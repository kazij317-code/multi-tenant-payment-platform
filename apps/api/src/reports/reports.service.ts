// // // import { Injectable } from '@nestjs/common';
// // // import { PrismaService } from '../prisma/prisma.service';

// // // @Injectable()
// // // export class ReportsService {
// // //   constructor(private prisma: PrismaService) {}

// // //   async getTransactionSummary(tenantId: string) {
// // //     // মোট ট্রানজেকশন সংখ্যা
// // //     const totalTransactions = await this.prisma.transaction.count({
// // //       where: { tenantId },
// // //     });

// // //     // সফল ট্রানজেকশনের মোট পরিমাণ (রেভিনিউ)
// // //     const successfulRevenue = await this.prisma.transaction.aggregate({
// // //       where: { 
// // //         tenantId, 
// // //         status: 'SUCCESS' // ধরে নিচ্ছি ট্রানজেকশন স্ট্যাটাস 'SUCCESS'
// // //       },
// // //       _sum: {
// // //         amount: true,
// // //       },
// // //     });

// // //     return {
// // //       totalTransactions,
// // //       totalRevenue: successfulRevenue._sum.amount || 0,
// // //     };
// // //   }
// // // }
// // // -----------------------

// // import { Injectable } from '@nestjs/common';
// // import { PrismaService } from '../prisma/prisma.service';

// // @Injectable()
// // export class ReportsService {
// //   constructor(private prisma: PrismaService) {}

// //   async getTransactionSummary(tenantId: string) {
// //     // নির্দিষ্ট টিনেন্টের সব মার্চেন্টের অধীনে থাকা ট্রানজেকশন গণনা করা
// //     const totalTransactions = await this.prisma.transaction.count({
// //       where: {
// //         merchant: {
// //           tenantId: tenantId,
// //         },
// //       },
// //     });

// //     // সফল ট্রানজেকশনের মোট পরিমাণ (রেভিনিউ) হিসাব করা
// //     const successfulRevenue = await this.prisma.transaction.aggregate({
// //       where: {
// //         status: 'SUCCESS',
// //         merchant: {
// //           tenantId: tenantId,
// //         },
// //       },
// //       _sum: {
// //         amount: true,
// //       },
// //     });

// //     return {
// //       totalTransactions,
// //       totalRevenue: successfulRevenue._sum.amount || 0,
// //     };
// //   }
// // }

// // ---------------

// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class ReportsService {
//   constructor(private prisma: PrismaService) {}

//   // নির্দিষ্ট টিনেন্টের ড্যাশবোর্ড সামারি তৈরি করা
//   async getTransactionSummary(tenantId: string) {
//     // ১. মোট মার্চেন্ট সংখ্যা
//     const totalMerchants = await this.prisma.merchant.count({
//       where: { tenantId },
//     });

//     // ২. এই টিনেন্টের অধীনে থাকা সব ট্রানজেকশন ফেচ করা
//     const transactions = await this.prisma.transaction.findMany({
//       where: {
//         merchant: {
//           tenantId: tenantId,
//         },
//       },
//       select: {
//         amount: true,
//         status: true,
//       },
//     });

//     const totalTransactions = transactions.length;
//     let totalVolume = 0;
//     let successfulVolume = 0;
//     let successfulCount = 0;
//     let pendingCount = 0;
//     let failedCount = 0;

//     // ট্রানজেকশনগুলোর ওপর লুপ চালিয়ে সামারি ক্যালকুলেট করা
//     transactions.forEach((tx) => {
//       totalVolume += tx.amount;

//       if (tx.status === 'SUCCESS') {
//         successfulVolume += tx.amount;
//         successfulCount++;
//       } else if (tx.status === 'PENDING') {
//         pendingCount++;
//       } else if (tx.status === 'FAILED') {
//         failedCount++;
//       }
//     });

//     return {
//       message: 'Dashboard summary retrieved successfully',
//       summary: {
//         totalMerchants,
//         totalTransactions,
//         totalVolume,
//         successfulVolume,
//         statusBreakdown: {
//           success: successfulCount,
//           pending: pendingCount,
//           failed: failedCount,
//         },
//       },
//     };
//   }
// }

// --------------------
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Parser } from 'json2csv';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // নির্দিষ্ট টিনেন্টের ড্যাশবোর্ড সামারি তৈরি করা
  async getTransactionSummary(tenantId: string) {
    // ১. মোট মার্চেন্ট সংখ্যা
    const totalMerchants = await this.prisma.merchant.count({
      where: { tenantId },
    });

    // ২. এই টিনেন্টের অধীনে থাকা সব ট্রানজেকশন ফেচ করা
    const transactions = await this.prisma.transaction.findMany({
      where: {
        merchant: {
          tenantId: tenantId,
        },
      },
      select: {
        amount: true,
        status: true,
      },
    });

    const totalTransactions = transactions.length;
    let totalVolume = 0;
    let successfulVolume = 0;
    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    // ট্রানজেকশনগুলোর ওপর লুপ চালিয়ে সামারি ক্যালকুলেট করা
    transactions.forEach((tx) => {
      totalVolume += tx.amount;

      if (tx.status === 'SUCCESS') {
        successfulVolume += tx.amount;
        successfulCount++;
      } else if (tx.status === 'PENDING') {
        pendingCount++;
      } else if (tx.status === 'FAILED') {
        failedCount++;
      }
    });

    return {
      message: 'Dashboard summary retrieved successfully',
      summary: {
        totalMerchants,
        totalTransactions,
        totalVolume,
        successfulVolume,
        statusBreakdown: {
          success: successfulCount,
          pending: pendingCount,
          failed: failedCount,
        },
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