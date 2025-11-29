import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = (session.user as any).tenantId
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter = startDate && endDate
      ? {
          shopifyCreatedAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {}

    // Get total customers
    const totalCustomers = await prisma.customer.count({
      where: { tenantId },
    })

    // Get total orders with date filter
    const totalOrders = await prisma.order.count({
      where: {
        tenantId,
        ...dateFilter,
      },
    })

    // Get total revenue with date filter
    const revenueResult = await prisma.order.aggregate({
      where: {
        tenantId,
        ...dateFilter,
      },
      _sum: {
        totalPrice: true,
      },
    })

    const totalRevenue = revenueResult._sum.totalPrice || 0

    // Get top 5 customers by spend
    const topCustomers = await prisma.customer.findMany({
      where: { tenantId },
      orderBy: {
        totalSpent: 'desc',
      },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        totalSpent: true,
        ordersCount: true,
      },
    })

    // Get orders by date for chart
    const ordersByDate = await prisma.$queryRaw`
      SELECT 
        DATE("shopifyCreatedAt") as date,
        COUNT(*)::int as count,
        SUM("totalPrice")::decimal as revenue
      FROM "Order"
      WHERE "tenantId" = ${tenantId}
        ${startDate && endDate ? prisma.$queryRaw`AND "shopifyCreatedAt" >= ${new Date(startDate)} AND "shopifyCreatedAt" <= ${new Date(endDate)}` : prisma.$queryRaw``}
      GROUP BY DATE("shopifyCreatedAt")
      ORDER BY date DESC
      LIMIT 30
    `

    // Get revenue trend (last 7 days)
    const revenueTrend = await prisma.$queryRaw`
      SELECT 
        DATE("shopifyCreatedAt") as date,
        SUM("totalPrice")::decimal as revenue
      FROM "Order"
      WHERE "tenantId" = ${tenantId}
        AND "shopifyCreatedAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("shopifyCreatedAt")
      ORDER BY date ASC
    `

    // Get customer growth trend (last 30 days)
    const customerGrowth = await prisma.$queryRaw`
      SELECT 
        DATE("shopifyCreatedAt") as date,
        COUNT(*)::int as count
      FROM "Customer"
      WHERE "tenantId" = ${tenantId}
        AND "shopifyCreatedAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("shopifyCreatedAt")
      ORDER BY date ASC
    `

    // Get average order value
    const avgOrderValue = totalOrders > 0 
      ? Number(totalRevenue) / totalOrders 
      : 0

    return NextResponse.json({
      summary: {
        totalCustomers,
        totalOrders,
        totalRevenue: Number(totalRevenue),
        avgOrderValue,
      },
      topCustomers,
      ordersByDate,
      revenueTrend,
      customerGrowth,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
