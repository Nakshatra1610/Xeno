import axios from 'axios'
import { prisma } from './prisma'

interface ShopifyCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  orders_count: number
  total_spent: string
  state: string
  tags: string
  created_at: string
  updated_at: string
}

interface ShopifyOrder {
  id: number
  order_number: number
  email: string
  customer: any
  total_price: string
  subtotal_price: string
  total_tax: string
  currency: string
  financial_status: string
  fulfillment_status: string
  billing_address: any
  shipping_address: any
  line_items: any[]
  created_at: string
  updated_at: string
}

interface ShopifyProduct {
  id: number
  title: string
  vendor: string
  product_type: string
  status: string
  tags: string
  handle: string
  created_at: string
  updated_at: string
}

export class ShopifyService {
  private shopDomain: string
  private accessToken: string

  constructor(shopDomain: string, accessToken: string) {
    this.shopDomain = shopDomain
    this.accessToken = accessToken
  }

  private getHeaders() {
    return {
      'X-Shopify-Access-Token': this.accessToken,
      'Content-Type': 'application/json',
    }
  }

  private getApiUrl(endpoint: string) {
    return `https://${this.shopDomain}/admin/api/2024-01/${endpoint}`
  }

  async syncCustomers(tenantId: string, limit = 250) {
    let hasMore = true
    let pageInfo = null

    while (hasMore) {
      const url = pageInfo
        ? this.getApiUrl(`customers.json?limit=${limit}&page_info=${pageInfo}`)
        : this.getApiUrl(`customers.json?limit=${limit}`)

      const response = await axios.get(url, { headers: this.getHeaders() })
      const customers: ShopifyCustomer[] = response.data.customers

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
            phone: customer.phone,
            ordersCount: customer.orders_count || 0,
            totalSpent: customer.total_spent || 0,
            state: customer.state,
            tags: customer.tags,
            shopifyUpdatedAt: new Date(customer.updated_at),
          },
          create: {
            tenantId,
            shopifyCustomerId: customer.id.toString(),
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            phone: customer.phone,
            ordersCount: customer.orders_count || 0,
            totalSpent: customer.total_spent || 0,
            state: customer.state,
            tags: customer.tags,
            shopifyCreatedAt: new Date(customer.created_at),
            shopifyUpdatedAt: new Date(customer.updated_at),
          },
        })
      }

      // Check for next page
      const linkHeader = response.headers.link
      hasMore = linkHeader?.includes('rel="next"') || false
      if (hasMore && linkHeader) {
        const match = linkHeader.match(/page_info=([^&>]+)/)
        pageInfo = match ? match[1] : null
      }

      if (customers.length < limit) {
        hasMore = false
      }
    }
  }

  async syncOrders(tenantId: string, limit = 250) {
    let hasMore = true
    let pageInfo = null

    while (hasMore) {
      const url = pageInfo
        ? this.getApiUrl(`orders.json?limit=${limit}&status=any&page_info=${pageInfo}`)
        : this.getApiUrl(`orders.json?limit=${limit}&status=any`)

      const response = await axios.get(url, { headers: this.getHeaders() })
      const orders: ShopifyOrder[] = response.data.orders

      for (const orderData of orders) {
        // Find or create customer
        let customerId = null
        if (orderData.customer) {
          const customer = await prisma.customer.upsert({
            where: {
              tenantId_shopifyCustomerId: {
                tenantId,
                shopifyCustomerId: orderData.customer.id.toString(),
              },
            },
            update: {
              email: orderData.customer.email,
              firstName: orderData.customer.first_name,
              lastName: orderData.customer.last_name,
              ordersCount: orderData.customer.orders_count || 0,
              totalSpent: orderData.customer.total_spent || 0,
            },
            create: {
              tenantId,
              shopifyCustomerId: orderData.customer.id.toString(),
              email: orderData.customer.email,
              firstName: orderData.customer.first_name,
              lastName: orderData.customer.last_name,
              ordersCount: orderData.customer.orders_count || 0,
              totalSpent: orderData.customer.total_spent || 0,
            },
          })
          customerId = customer.id
        }

        // Upsert order
        const order = await prisma.order.upsert({
          where: {
            tenantId_shopifyOrderId: {
              tenantId,
              shopifyOrderId: orderData.id.toString(),
            },
          },
          update: {
            customerId,
            orderNumber: orderData.order_number,
            email: orderData.email,
            totalPrice: orderData.total_price,
            subtotalPrice: orderData.subtotal_price,
            totalTax: orderData.total_tax,
            currency: orderData.currency,
            financialStatus: orderData.financial_status,
            fulfillmentStatus: orderData.fulfillment_status,
            billingAddress: orderData.billing_address,
            shippingAddress: orderData.shipping_address,
            shopifyUpdatedAt: new Date(orderData.updated_at),
          },
          create: {
            tenantId,
            shopifyOrderId: orderData.id.toString(),
            customerId,
            orderNumber: orderData.order_number,
            email: orderData.email,
            totalPrice: orderData.total_price,
            subtotalPrice: orderData.subtotal_price,
            totalTax: orderData.total_tax,
            currency: orderData.currency,
            financialStatus: orderData.financial_status,
            fulfillmentStatus: orderData.fulfillment_status,
            billingAddress: orderData.billing_address,
            shippingAddress: orderData.shipping_address,
            shopifyCreatedAt: new Date(orderData.created_at),
            shopifyUpdatedAt: new Date(orderData.updated_at),
          },
        })

        // Delete existing order items
        await prisma.orderItem.deleteMany({
          where: { orderId: order.id },
        })

        // Create order items
        if (orderData.line_items && orderData.line_items.length > 0) {
          for (const item of orderData.line_items) {
            let productId = null
            if (item.product_id) {
              const product = await prisma.product.findUnique({
                where: {
                  tenantId_shopifyProductId: {
                    tenantId,
                    shopifyProductId: item.product_id.toString(),
                  },
                },
              })
              productId = product?.id || null
            }

            await prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId,
                shopifyProductId: item.product_id?.toString(),
                shopifyVariantId: item.variant_id?.toString(),
                title: item.title,
                quantity: item.quantity,
                price: item.price,
              },
            })
          }
        }
      }

      // Check for next page
      const linkHeader = response.headers.link
      hasMore = linkHeader?.includes('rel="next"') || false
      if (hasMore && linkHeader) {
        const match = linkHeader.match(/page_info=([^&>]+)/)
        pageInfo = match ? match[1] : null
      }

      if (orders.length < limit) {
        hasMore = false
      }
    }
  }

  async syncProducts(tenantId: string, limit = 250) {
    let hasMore = true
    let pageInfo = null

    while (hasMore) {
      const url = pageInfo
        ? this.getApiUrl(`products.json?limit=${limit}&page_info=${pageInfo}`)
        : this.getApiUrl(`products.json?limit=${limit}`)

      const response = await axios.get(url, { headers: this.getHeaders() })
      const products: ShopifyProduct[] = response.data.products

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
            status: product.status,
            tags: product.tags,
            handle: product.handle,
            shopifyUpdatedAt: new Date(product.updated_at),
          },
          create: {
            tenantId,
            shopifyProductId: product.id.toString(),
            title: product.title,
            vendor: product.vendor,
            productType: product.product_type,
            status: product.status,
            tags: product.tags,
            handle: product.handle,
            shopifyCreatedAt: new Date(product.created_at),
            shopifyUpdatedAt: new Date(product.updated_at),
          },
        })
      }

      // Check for next page
      const linkHeader = response.headers.link
      hasMore = linkHeader?.includes('rel="next"') || false
      if (hasMore && linkHeader) {
        const match = linkHeader.match(/page_info=([^&>]+)/)
        pageInfo = match ? match[1] : null
      }

      if (products.length < limit) {
        hasMore = false
      }
    }
  }

  async syncAll(tenantId: string) {
    console.log(`Starting sync for tenant ${tenantId}`)
    await this.syncProducts(tenantId)
    await this.syncCustomers(tenantId)
    await this.syncOrders(tenantId)
    console.log(`Sync completed for tenant ${tenantId}`)
  }
}

export async function syncAllTenants() {
  const tenants = await prisma.tenant.findMany({
    where: { isActive: true },
  })

  for (const tenant of tenants) {
    try {
      const service = new ShopifyService(tenant.shopifyDomain, tenant.shopifyAccessToken)
      await service.syncAll(tenant.id)
    } catch (error) {
      console.error(`Sync failed for tenant ${tenant.id}:`, error)
    }
  }
}
