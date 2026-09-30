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

  // নির্দিষ্ট টিনেন্টের ড্যাশবোর্ড সামারি তৈরি করা
  async getTransactionSummary(tenantId: string) {
    const totalMerchants = await this.prisma.merchant.count({
      where: { tenantId },
    });

    const totalUsers = await this.prisma.user.count({
      where: { tenantId },
    });

    const activeApiKeys = await this.prisma.apiKey.count({
      where: { tenantId },
    });

    const totalTransactions = await this.prisma.transaction.count({
      where: { merchant: { tenantId } },
    });

    const failedTransactions = await this.prisma.transaction.count({
      where: {
        merchant: { tenantId },
        OR: [{ status: 'FAILED' }, { status: 'REJECTED' }],
      },
    });

    const revenueAgg = await this.prisma.transaction.aggregate({
      where: {
        merchant: { tenantId },
        OR: [{ status: 'SUCCESS' }, { status: 'COMPLETED' }],
      },
      _sum: { amount: true },
    });
    const revenue = revenueAgg._sum.amount || 0;

    const totalVolumeAgg = await this.prisma.transaction.aggregate({
      where: { merchant: { tenantId } },
      _sum: { amount: true },
    });
    const totalVolume = totalVolumeAgg._sum.amount || 0;

    const recentTransactions = await this.prisma.transaction.findMany({
      where: { merchant: { tenantId } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: { select: { id: true, name: true, email: true } },
      },
    });

    const statusCounts = await this.prisma.transaction.groupBy({
      by: ['status'],
      where: { merchant: { tenantId } },
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
      },
    };
  }

  // ৩. ট্রানজেকশন ডেটা সিএসভি ফরম্যাটে এক্সপোর্ট করার মেথড
  async exportTransactionsCsv(tenantId: string): Promise<string> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        merchant: { tenantId },
      },
      include: {
        merchant: true,
      },
    });

    const data = transactions.map((tx) => ({
      ID: tx.id,
      Reference: tx.reference,
      Amount: tx.amount,
      Currency: tx.currency,
      Status: tx.status,
      MerchantName: tx.merchant?.name || 'N/A',
      CreatedAt: tx.createdAt.toISOString(),
    }));

    const fields = ['ID', 'Reference', 'Amount', 'Currency', 'Status', 'MerchantName', 'CreatedAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    return csv;
  }
}