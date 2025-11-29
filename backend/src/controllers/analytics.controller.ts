import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;
    const tenantId = req.user!.tenantId;

    const fromDate = from ? new Date(from as string) : new Date(0);
    const toDate = to ? new Date(to as string) : new Date();

    // Total customers
    const totalCustomers = await prisma.customer.count({
      where: { tenantId },
    });

    // Total orders
    const totalOrders = await prisma.order.count({
      where: {
        tenantId,
        shopifyCreatedAt: { gte: fromDate, lte: toDate },
      },
    });

    // Total revenue
    const revenueData = await prisma.order.aggregate({
      where: {
        tenantId,
        shopifyCreatedAt: { gte: fromDate, lte: toDate },
      },
      _sum: { totalPrice: true },
    });
    const totalRevenue = revenueData._sum.totalPrice || 0;

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue trend (last 30 days)
    const revenueTrend = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE("shopifyCreatedAt") as date,
        SUM("totalPrice") as revenue
      FROM "Order"
      WHERE "tenantId" = ${tenantId}
        AND "shopifyCreatedAt" >= ${fromDate}
        AND "shopifyCreatedAt" <= ${toDate}
      GROUP BY DATE("shopifyCreatedAt")
      ORDER BY date ASC
    `;

    // Customer growth trend
    const customerGrowth = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Customer"
      WHERE "tenantId" = ${tenantId}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Orders by date
    const ordersByDate = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE("shopifyCreatedAt") as date,
        COUNT(*) as count
      FROM "Order"
      WHERE "tenantId" = ${tenantId}
        AND "shopifyCreatedAt" >= ${fromDate}
        AND "shopifyCreatedAt" <= ${toDate}
      GROUP BY DATE("shopifyCreatedAt")
      ORDER BY date ASC
    `;

    // Top customers
    const topCustomers = await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { totalSpent: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        totalSpent: true,
        ordersCount: true,
      },
    });

    res.json({
      totalCustomers,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      revenueTrend: revenueTrend.map(item => ({
        date: item.date,
        revenue: Number(item.revenue),
      })),
      customerGrowth: customerGrowth.map(item => ({
        date: item.date,
        count: Number(item.count),
      })),
      ordersByDate: ordersByDate.map(item => ({
        date: item.date,
        count: Number(item.count),
      })),
      topCustomers,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
