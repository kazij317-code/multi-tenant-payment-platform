// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class ReportsService {
//   constructor(private prisma: PrismaService) {}

//   async getTransactionSummary(tenantId: string) {
//     // মোট ট্রানজেকশন সংখ্যা
//     const totalTransactions = await this.prisma.transaction.count({
//       where: { tenantId },
//     });

//     // সফল ট্রানজেকশনের মোট পরিমাণ (রেভিনিউ)
//     const successfulRevenue = await this.prisma.transaction.aggregate({
//       where: { 
//         tenantId, 
//         status: 'SUCCESS' // ধরে নিচ্ছি ট্রানজেকশন স্ট্যাটাস 'SUCCESS'
//       },
//       _sum: {
//         amount: true,
//       },
//     });

//     return {
//       totalTransactions,
//       totalRevenue: successfulRevenue._sum.amount || 0,
//     };
//   }
// }
// -----------------------

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getTransactionSummary(tenantId: string) {
    // নির্দিষ্ট টিনেন্টের সব মার্চেন্টের অধীনে থাকা ট্রানজেকশন গণনা করা
    const totalTransactions = await this.prisma.transaction.count({
      where: {
        merchant: {
          tenantId: tenantId,
        },
      },
    });

    // সফল ট্রানজেকশনের মোট পরিমাণ (রেভিনিউ) হিসাব করা
    const successfulRevenue = await this.prisma.transaction.aggregate({
      where: {
        status: 'SUCCESS',
        merchant: {
          tenantId: tenantId,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalTransactions,
      totalRevenue: successfulRevenue._sum.amount || 0,
    };
  }
}