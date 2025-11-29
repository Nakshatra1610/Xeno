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

    // Find tenant by shop domain
    const tenant = await prisma.tenant.findUnique({
      where: { shopifyDomain: shopDomain },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Verify webhook authenticity
    const isValid = verifyShopifyWebhook(
      rawBody,
      hmacHeader,
      process.env.SHOPIFY_WEBHOOK_SECRET || ''
    )

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    const customerData = JSON.parse(rawBody)

    // Upsert customer data
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
        phone: customerData.phone,
        ordersCount: customerData.orders_count || 0,
        totalSpent: customerData.total_spent || 0,
        state: customerData.state,
        tags: customerData.tags,
        shopifyUpdatedAt: new Date(customerData.updated_at),
      },
      create: {
        tenantId: tenant.id,
        shopifyCustomerId: customerData.id.toString(),
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        phone: customerData.phone,
        ordersCount: customerData.orders_count || 0,
        totalSpent: customerData.total_spent || 0,
        state: customerData.state,
        tags: customerData.tags,
        shopifyCreatedAt: new Date(customerData.created_at),
        shopifyUpdatedAt: new Date(customerData.updated_at),
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Customer webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
