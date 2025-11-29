import axios from 'axios';
import { prisma } from '../config/database';

interface ShopifyConfig {
  domain: string;
  accessToken: string;
}

class ShopifyService {
  private config: ShopifyConfig;
  private baseURL: string;

  constructor(config: ShopifyConfig) {
    this.config = config;
    this.baseURL = `https://${config.domain}/admin/api/2024-01`;
  }

  private async makeRequest(endpoint: string) {
    try {
      const response = await axios.get(`${this.baseURL}/${endpoint}`, {
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Shopify API error for ${endpoint}:`, error);
      throw error;
    }
  }

  async syncCustomers(tenantId: string) {
    try {
      const data = await this.makeRequest('customers.json?limit=250');
      const customers = data.customers || [];

      for (const customer of customers) {
        await prisma.customer.upsert({
          where: {
            tenantId_shopifyCustomerId: {
              tenantId,
              shopifyCustomerId: customer.id.toString(),
            },
          },
          update: {
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            totalSpent: parseFloat(customer.total_spent || '0'),
            ordersCount: customer.orders_count || 0,
            tags: customer.tags ? customer.tags.split(', ') : [],
          },
          create: {
            tenantId,
            shopifyCustomerId: customer.id.toString(),
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            totalSpent: parseFloat(customer.total_spent || '0'),
            ordersCount: customer.orders_count || 0,
            tags: customer.tags ? customer.tags.split(', ') : [],
          },
        });
      }

      return customers.length;
    } catch (error) {
      console.error('Error syncing customers:', error);
      throw error;
    }
  }

  async syncOrders(tenantId: string) {
    try {
      const data = await this.makeRequest('orders.json?limit=250&status=any');
      const orders = data.orders || [];

      for (const order of orders) {
        let customer = await prisma.customer.findFirst({
          where: {
            tenantId,
            email: order.email,
          },
        });

        if (!customer && order.customer) {
          customer = await prisma.customer.create({
            data: {
              tenantId,
              shopifyCustomerId: order.customer.id.toString(),
              email: order.customer.email,
              firstName: order.customer.first_name,
              lastName: order.customer.last_name,
            },
          });
        }

        await prisma.order.upsert({
          where: {
            tenantId_shopifyOrderId: {
              tenantId,
              shopifyOrderId: order.id.toString(),
            },
          },
          update: {
            financialStatus: order.financial_status?.toUpperCase(),
            fulfillmentStatus: order.fulfillment_status?.toUpperCase(),
          },
          create: {
            tenantId,
            shopifyOrderId: order.id.toString(),
            orderNumber: order.order_number,
            customerId: customer?.id,
            email: order.email,
            financialStatus: order.financial_status?.toUpperCase(),
            fulfillmentStatus: order.fulfillment_status?.toUpperCase(),
            totalPrice: parseFloat(order.total_price),
            subtotalPrice: parseFloat(order.subtotal_price),
            totalTax: parseFloat(order.total_tax),
            currency: order.currency,
            shopifyCreatedAt: new Date(order.created_at),
            billingAddress: order.billing_address,
            shippingAddress: order.shipping_address,
          },
        });
      }

      return orders.length;
    } catch (error) {
      console.error('Error syncing orders:', error);
      throw error;
    }
  }

  async syncProducts(tenantId: string) {
    try {
      const data = await this.makeRequest('products.json?limit=250');
      const products = data.products || [];

      for (const product of products) {
        await prisma.product.upsert({
          where: {
            tenantId_shopifyProductId: {
              tenantId,
              shopifyProductId: product.id.toString(),
            },
          },
          update: {
            title: product.title,
            vendor: product.vendor,
            productType: product.product_type,
            status: product.status?.toUpperCase(),
            tags: product.tags ? product.tags.split(', ') : [],
          },
          create: {
            tenantId,
            shopifyProductId: product.id.toString(),
            title: product.title,
            vendor: product.vendor,
            productType: product.product_type,
            status: product.status?.toUpperCase(),
            tags: product.tags ? product.tags.split(', ') : [],
          },
        });
      }

      return products.length;
    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  }

  async syncAll(tenantId: string) {
    const customers = await this.syncCustomers(tenantId);
    const orders = await this.syncOrders(tenantId);
    const products = await this.syncProducts(tenantId);

    return { customers, orders, products };
  }
}

export async function syncTenant(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    throw new Error('Tenant not found');
  }

  const service = new ShopifyService({
    domain: tenant.shopifyDomain,
    accessToken: tenant.shopifyAccessToken,
  });

  const result = await service.syncAll(tenantId);
  console.log(`Synced tenant ${tenant.name}:`, result);
  return result;
}

export async function syncAllTenants() {
  const tenants = await prisma.tenant.findMany();

  for (const tenant of tenants) {
    try {
      await syncTenant(tenant.id);
    } catch (error) {
      console.error(`Failed to sync tenant ${tenant.name}:`, error);
    }
  }
}
