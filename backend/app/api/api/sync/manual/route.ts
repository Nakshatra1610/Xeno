import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ShopifyService } from '@/lib/shopify-sync'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = (session.user as any).tenantId

    // Get tenant details
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Perform sync
    const service = new ShopifyService(tenant.shopifyDomain, tenant.shopifyAccessToken)
    await service.syncAll(tenant.id)

    return NextResponse.json({ success: true, message: 'Manual sync completed' })
  } catch (error) {
    console.error('Manual sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
