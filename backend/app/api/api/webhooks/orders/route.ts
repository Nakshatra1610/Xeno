import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyShopifyWebhook } from '@/lib/shopify-utils'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256')
    const shopDomain = req.headers.get('x-shopify-shop-domain')

    if (!hmacHeader || !shopDomain) {
      return NextResponse.json({ error: 'Missing headers' }, { status: 400 })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { shopifyDomain: shopDomain },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const isValid = verifyShopifyWebhook(
      rawBody,
      hmacHeader,
      process.env.SHOPIFY_WEBHOOK_SECRET || ''
    )

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    const orderData = JSON.parse(rawBody)

    // Find or create customer if exists
    let customerId = null
    if (orderData.customer) {
      const customer = await prisma.customer.upsert({
        where: {
          tenantId_shopifyCustomerId: {
            tenantId: tenant.id,
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
          tenantId: tenant.id,
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
          tenantId: tenant.id,
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
        tenantId: tenant.id,
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

    // Delete existing order items and create new ones
    await prisma.orderItem.deleteMany({
      where: { orderId: order.id },
    })

    // Create order items
    if (orderData.line_items && orderData.line_items.length > 0) {
      for (const item of orderData.line_items) {
        // Try to find product
        let productId = null
        if (item.product_id) {
          const product = await prisma.product.findUnique({
            where: {
              tenantId_shopifyProductId: {
                tenantId: tenant.id,
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

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Order webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
