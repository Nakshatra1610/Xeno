import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/database';

// Verify Shopify HMAC signature
const verifyShopifyWebhook = (body: string, hmacHeader: string, secret: string): boolean => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
  return hash === hmacHeader;
};

// Extract Shopify domain from headers
const getShopifyDomain = (req: Request): string | null => {
  return req.headers['x-shopify-shop-domain'] as string || null;
};

export const handleCustomerWebhook = async (req: Request, res: Response) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifyShopifyWebhook(rawBody, hmacHeader, process.env.SHOPIFY_WEBHOOK_SECRET!)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const shopifyDomain = getShopifyDomain(req);
    if (!shopifyDomain) {
      return res.status(400).json({ error: 'Missing Shopify domain' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { shopifyDomain } });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const customerData = req.body;

    await prisma.customer.upsert({
      where: {
        tenantId_shopifyCustomerId: {
          tenantId: tenant.id,
          shopifyCustomerId: customerData.id.toString(),
        },
      },
      update: {
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        totalSpent: parseFloat(customerData.total_spent || '0'),
        ordersCount: customerData.orders_count || 0,
        tags: customerData.tags ? customerData.tags.split(', ') : [],
      },
      create: {
        tenantId: tenant.id,
        shopifyCustomerId: customerData.id.toString(),
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        totalSpent: parseFloat(customerData.total_spent || '0'),
        ordersCount: customerData.orders_count || 0,
        tags: customerData.tags ? customerData.tags.split(', ') : [],
      },
    });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Customer webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const handleOrderWebhook = async (req: Request, res: Response) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifyShopifyWebhook(rawBody, hmacHeader, process.env.SHOPIFY_WEBHOOK_SECRET!)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const shopifyDomain = getShopifyDomain(req);
    if (!shopifyDomain) {
      return res.status(400).json({ error: 'Missing Shopify domain' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { shopifyDomain } });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const orderData = req.body;

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        tenantId: tenant.id,
        email: orderData.email,
      },
    });

    if (!customer && orderData.customer) {
      customer = await prisma.customer.create({
        data: {
          tenantId: tenant.id,
          shopifyCustomerId: orderData.customer.id.toString(),
          email: orderData.customer.email,
          firstName: orderData.customer.first_name,
          lastName: orderData.customer.last_name,
        },
      });
    }

    await prisma.order.upsert({
      where: {
        tenantId_shopifyOrderId: {
          tenantId: tenant.id,
          shopifyOrderId: orderData.id.toString(),
        },
      },
      update: {
        financialStatus: orderData.financial_status?.toUpperCase(),
        fulfillmentStatus: orderData.fulfillment_status?.toUpperCase(),
      },
      create: {
        tenantId: tenant.id,
        shopifyOrderId: orderData.id.toString(),
        orderNumber: orderData.order_number,
        customerId: customer?.id,
        email: orderData.email,
        financialStatus: orderData.financial_status?.toUpperCase(),
        fulfillmentStatus: orderData.fulfillment_status?.toUpperCase(),
        totalPrice: parseFloat(orderData.total_price),
        subtotalPrice: parseFloat(orderData.subtotal_price),
        totalTax: parseFloat(orderData.total_tax),
        currency: orderData.currency,
        shopifyCreatedAt: new Date(orderData.created_at),
        billingAddress: orderData.billing_address,
        shippingAddress: orderData.shipping_address,
      },
    });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Order webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const handleProductWebhook = async (req: Request, res: Response) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifyShopifyWebhook(rawBody, hmacHeader, process.env.SHOPIFY_WEBHOOK_SECRET!)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const shopifyDomain = getShopifyDomain(req);
    if (!shopifyDomain) {
      return res.status(400).json({ error: 'Missing Shopify domain' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { shopifyDomain } });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const productData = req.body;

    await prisma.product.upsert({
      where: {
        tenantId_shopifyProductId: {
          tenantId: tenant.id,
          shopifyProductId: productData.id.toString(),
        },
      },
      update: {
        title: productData.title,
        vendor: productData.vendor,
        productType: productData.product_type,
        status: productData.status?.toUpperCase(),
        tags: productData.tags ? productData.tags.split(', ') : [],
      },
      create: {
        tenantId: tenant.id,
        shopifyProductId: productData.id.toString(),
        title: productData.title,
        vendor: productData.vendor,
        productType: productData.product_type,
        status: productData.status?.toUpperCase(),
        tags: productData.tags ? productData.tags.split(', ') : [],
      },
    });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Product webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const handleCartAbandonedWebhook = async (req: Request, res: Response) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifyShopifyWebhook(rawBody, hmacHeader, process.env.SHOPIFY_WEBHOOK_SECRET!)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const shopifyDomain = getShopifyDomain(req);
    if (!shopifyDomain) {
      return res.status(400).json({ error: 'Missing Shopify domain' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { shopifyDomain } });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const cartData = req.body;

    await prisma.customEvent.create({
      data: {
        tenantId: tenant.id,
        eventType: 'CART_ABANDONED',
        metadata: cartData,
      },
    });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Cart abandoned webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
