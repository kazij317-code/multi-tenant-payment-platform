import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Parser } from 'json2csv';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // গ্লোবাল সিস্টেম ওভারভিউ (সুপার অ্যাডমিনদের জন্য)
  async getGlobalSystemSummary() {
    const totalTenants = await this.prisma.tenant.count();
    const activeTenants = await this.prisma.tenant.count({ where: { status: 'ACTIVE' } });
    const totalMerchants = await this.prisma.merchant.count();
    const totalUsers = await this.prisma.user.count();
    const totalTransactions = await this.prisma.transaction.count();

    const failedTransactions = await this.prisma.transaction.count({
      where: {
        OR: [{ status: 'FAILED' }, { status: 'REJECTED' }],
      },
    });

    const successfulAgg = await this.prisma.transaction.aggregate({
      where: {
        OR: [{ status: 'SUCCESS' }, { status: 'COMPLETED' }],
      },
      _sum: { amount: true },
    });
    const revenue = successfulAgg._sum.amount || 0;

    const totalVolumeAgg = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
    });
    const totalVolume = totalVolumeAgg._sum.amount || 0;

    const recentTransactions = await this.prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: {
          include: {
            tenant: { select: { name: true, slug: true } },
          },
        },
      },
    });

    // Status breakdown chart data
    const statusCounts = await this.prisma.transaction.groupBy({
      by: ['status'],
      _count: { _all: true },
      _sum: { amount: true },
    });

    const statusBreakdown = statusCounts.map((item) => ({
      status: item.status,
      count: item._count._all,
      volume: item._sum.amount || 0,
    }));

    return {
      message: 'Global system overview retrieved successfully',
      summary: {
        totalTenants,
        activeTenants,
        totalMerchants,
        totalUsers,
        totalTransactions,
        revenue,
        totalVolume,
        failedTransactions,
        systemHealth: '100% Operational',
        recentTransactions,
        chartData: statusBreakdown,
      },
    };
  }

  // Build date filter clause helper
  private buildDateWhereClause(startDate?: string, endDate?: string, period?: string) {
    const where: any = {};
    const now = new Date();

    if (period === 'daily') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      where.createdAt = { gte: startOfDay };
    } else if (period === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      where.createdAt = { gte: startOfMonth };
    } else if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // set to end of that day if plain date string (e.g. 2026-09-30T23:59:59)
        const end = new Date(endDate);
        if (endDate.length <= 10) {
          end.setHours(23, 59, 59, 999);
        }
        where.createdAt.lte = end;
      }
    }
    return where;
  }

  // নির্দিষ্ট টিনেন্টের ড্যাশবোর্ড ও রিপোর্টিং সামারি তৈরি করা (Super Admin-এর জন্য গ্লোবাল)
  async getTransactionSummary(
    tenantId?: string,
    period?: string,
    startDate?: string,
    endDate?: string,
    isSuperAdmin: boolean = false,
  ) {
    const dateWhere = this.buildDateWhereClause(startDate, endDate, period);
    const tenantWhere = isSuperAdmin || !tenantId ? {} : { tenantId };

    const totalMerchants = await this.prisma.merchant.count({
      where: tenantWhere,
    });

    const totalUsers = await this.prisma.user.count({
      where: tenantWhere,
    });

    const activeApiKeys = await this.prisma.apiKey.count({
      where: tenantWhere,
    });

    const txWhereClause = {
      ...(isSuperAdmin || !tenantId ? {} : { merchant: { tenantId } }),
      ...dateWhere,
    };

    const totalTransactions = await this.prisma.transaction.count({
      where: txWhereClause,
    });

    const failedTransactions = await this.prisma.transaction.count({
      where: {
        ...txWhereClause,
        OR: [{ status: 'FAILED' }, { status: 'REJECTED' }],
      },
    });

    const revenueAgg = await this.prisma.transaction.aggregate({
      where: {
        ...txWhereClause,
        OR: [{ status: 'SUCCESS' }, { status: 'COMPLETED' }],
      },
      _sum: { amount: true },
    });
    const revenue = revenueAgg._sum.amount || 0;

    const totalVolumeAgg = await this.prisma.transaction.aggregate({
      where: txWhereClause,
      _sum: { amount: true },
    });
    const totalVolume = totalVolumeAgg._sum.amount || 0;

    const recentTransactions = await this.prisma.transaction.findMany({
      where: txWhereClause,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: { select: { id: true, name: true, email: true } },
      },
    });

    const statusCounts = await this.prisma.transaction.groupBy({
      by: ['status'],
      where: txWhereClause,
      _count: { _all: true },
      _sum: { amount: true },
    });

    const statusBreakdown = statusCounts.map((item) => ({
      status: item.status,
      count: item._count._all,
      volume: item._sum.amount || 0,
    }));

    return {
      message: 'Dashboard summary retrieved successfully',
      summary: {
        totalMerchants,
        totalUsers,
        totalTransactions,
        revenue,
        totalVolume,
        failedTransactions,
        activeApiKeys,
        recentTransactions,
        chartData: statusBreakdown,
        period: period || 'all',
        startDate,
        endDate,
      },
    };
  }

  // ৩. ট্রানজেকশন ডেটা সিএসভি ফরম্যাটে এক্সপোর্ট করার মেথড
  async exportTransactionsCsv(
    tenantId?: string,
    period?: string,
    startDate?: string,
    endDate?: string,
    isSuperAdmin: boolean = false,
  ): Promise<string> {
    const dateWhere = this.buildDateWhereClause(startDate, endDate, period);
    const txWhereClause = {
      ...(isSuperAdmin || !tenantId ? {} : { merchant: { tenantId } }),
      ...dateWhere,
    };

    const transactions = await this.prisma.transaction.findMany({
      where: txWhereClause,
      include: {
        merchant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = transactions.map((tx) => ({
      ID: tx.id,
      Reference: tx.reference,
      Amount: tx.amount,
      Currency: tx.currency,
      Status: tx.status,
      PaymentMethod: tx.paymentMethod || 'N/A',
      MerchantName: tx.merchant?.name || 'N/A',
      CreatedAt: tx.createdAt.toISOString(),
    }));

    const fields = ['ID', 'Reference', 'Amount', 'Currency', 'Status', 'PaymentMethod', 'MerchantName', 'CreatedAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    return csv;
  }
}