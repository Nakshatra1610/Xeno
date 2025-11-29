import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyShopifyWebhook } from '@/lib/shopify-utils'

// Cart abandoned webhook
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

    const cartData = JSON.parse(rawBody)

    // Store cart abandoned event
    await prisma.customEvent.create({
      data: {
        tenantId: tenant.id,
        eventType: 'cart_abandoned',
        shopifyCustomerId: cartData.customer?.id?.toString(),
        email: cartData.email,
        data: cartData,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Cart abandoned webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
