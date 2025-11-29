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

    const productData = JSON.parse(rawBody)

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
        status: productData.status,
        tags: productData.tags,
        handle: productData.handle,
        shopifyUpdatedAt: new Date(productData.updated_at),
      },
      create: {
        tenantId: tenant.id,
        shopifyProductId: productData.id.toString(),
        title: productData.title,
        vendor: productData.vendor,
        productType: productData.product_type,
        status: productData.status,
        tags: productData.tags,
        handle: productData.handle,
        shopifyCreatedAt: new Date(productData.created_at),
        shopifyUpdatedAt: new Date(productData.updated_at),
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Product webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
