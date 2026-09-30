// // // // import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// // // // import { PrismaService } from '../prisma/prisma.service';

// // // // @Injectable()
// // // // export class TransactionsService {
// // // //   constructor(private prisma: PrismaService) {}

// // // //   // নতুন ট্রানজেকশন তৈরি বা প্রসেস করা
// // // //   async createTransaction(dto: {
// // // //     amount: number;
// // // //     currency?: string;
// // // //     reference: string;
// // // //     merchantId: string;
// // // //     status?: string;
// // // //   }, tenantId: string) {
// // // //     // ১. মার্চেন্টটি এই টিনেন্টের অধীনে আছে কি না যাচাই করা
// // // //     const merchant = await this.prisma.merchant.findFirst({
// // // //       where: {
// // // //         id: dto.merchantId,
// // // //         tenantId: tenantId,
// // // //       },
// // // //     });

// // // //     if (!merchant) {
// // // //       throw new NotFoundException('Merchant not found or does not belong to this tenant');
// // // //     }

// // // //     // ২. একই রেফারেন্সের ট্রানজেকশন আগে আছে কি না চেক করা
// // // //     const existingTx = await this.prisma.transaction.findUnique({
// // // //       where: { reference: dto.reference },
// // // //     });

// // // //     if (existingTx) {
// // // //       throw new BadRequestException('Transaction with this reference already exists');
// // // //     }

// // // //     // ৩. ট্রানজেকশন তৈরি করা
// // // //     const transaction = await this.prisma.transaction.create({
// // // //       data: {
// // // //         amount: dto.amount,
// // // //         currency: dto.currency || 'BDT',
// // // //         status: dto.status || 'SUCCESS', // টেস্টের জন্য ডিফল্ট SUCCESS রাখতে পারো
// // // //         reference: dto.reference,
// // // //         merchantId: dto.merchantId,
// // // //       },
// // // //     });

// // // //     return {
// // // //       message: 'Transaction processed successfully',
// // // //       transaction,
// // // //     };
// // // //   }

// // // //   // নির্দিষ্ট টিনেন্টের সব ট্রানজেকশন দেখা
// // // //   async getTransactionsByTenant(tenantId: string) {
// // // //     return this.prisma.transaction.findMany({
// // // //       where: {
// // // //         merchant: {
// // // //           tenantId: tenantId,
// // // //         },
// // // //       },
// // // //       include: {
// // // //         merchant: {
// // // //           select: { name: true, email: true },
// // // //         },
// // // //       },
// // // //       orderBy: { createdAt: 'desc' },
// // // //     });
// // // //   }
// // // // }
// // // // ------------------

// // // import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// // // import { PrismaService } from '../prisma/prisma.service';
// // // import { TransactionStatus } from '@prisma/client';

// // // @Injectable()
// // // export class TransactionsService {
// // //   constructor(private prisma: PrismaService) {}

// // //   // নতুন ট্রানজেকশন তৈরি (টিনেন্ট আইসোলেশন সহ)
// // //   async createTransaction(
// // //     dto: {
// // //       amount: number;
// // //       currency?: string;
// // //       reference: string;
// // //       merchantId: string;
// // //       status?: TransactionStatus;
// // //     },
// // //     tenantId: string,
// // //   ) {
// // //     // মার্চেন্টটি এই টিনেন্টের অধীনে আছে কি না যাচাই করা
// // //     const merchant = await this.prisma.merchant.findFirst({
// // //       where: {
// // //         id: dto.merchantId,
// // //         tenantId: tenantId,
// // //       },
// // //     });

// // //     if (!merchant) {
// // //       throw new NotFoundException('Merchant not found or does not belong to this tenant');
// // //     }

// // //     // ইউনিক রেফারেন্স চেক করা
// // //     const existingTx = await this.prisma.transaction.findUnique({
// // //       where: { reference: dto.reference },
// // //     });

// // //     if (existingTx) {
// // //       throw new BadRequestException('Transaction with this reference already exists');
// // //     }

// // //     const transaction = await this.prisma.transaction.create({
// // //       data: {
// // //         amount: dto.amount,
// // //         currency: dto.currency || 'BDT',
// // //         status: dto.status || TransactionStatus.PENDING,
// // //         reference: dto.reference,
// // //         merchantId: dto.merchantId,
// // //       },
// // //     });

// // //     return {
// // //       message: 'Transaction processed successfully',
// // //       transaction,
// // //     };
// // //   }

// // //   // নির্দিষ্ট টিনেন্টের ট্রানজেকশন লিস্ট ও স্ট্যাটাস/মার্চেন্ট ফিল্টারিং
// // //   async getTransactionsByTenant(
// // //     tenantId: string,
// // //     status?: TransactionStatus,
// // //     merchantId?: string,
// // //   ) {
// // //     return this.prisma.transaction.findMany({
// // //       where: {
// // //         merchant: {
// // //           tenantId: tenantId,
// // //         },
// // //         ...(status && { status }),
// // //         ...(merchantId && { merchantId }),
// // //       },
// // //       include: {
// // //         merchant: {
// // //           select: { id: true, name: true, email: true },
// // //         },
// // //       },
// // //       orderBy: { createdAt: 'desc' },
// // //     });
// // //   }

// // //   // ট্রানজেকশনের স্ট্যাটাস আপডেট করা
// // //   async updateTransactionStatus(transactionId: string, status: TransactionStatus) {
// // //     const transaction = await this.prisma.transaction.findUnique({
// // //       where: { id: transactionId },
// // //     });

// // //     if (!transaction) {
// // //       throw new NotFoundException('Transaction not found');
// // //     }

// // //     const updatedTransaction = await this.prisma.transaction.update({
// // //       where: { id: transactionId },
// // //       data: { status },
// // //     });

// // //     return {
// // //       message: `Transaction status updated to ${status} successfully`,
// // //       transaction: updatedTransaction,
// // //     };
// // //   }

// // //   // পেমেন্ট গেটওয়ে থেকে আসা ওয়েবহুক হ্যান্ডেল করা
// // //   async handlePaymentWebhook(dto: { reference: string; status: TransactionStatus }) {
// // //     const transaction = await this.prisma.transaction.findUnique({
// // //       where: { reference: dto.reference },
// // //     });

// // //     if (!transaction) {
// // //       throw new BadRequestException('Transaction reference not found');
// // //     }

// // //     const updatedTransaction = await this.prisma.transaction.update({
// // //       where: { id: transaction.id },
// // //       data: { status: dto.status },
// // //     });

// // //     return {
// // //       success: true,
// // //       message: `Webhook processed. Transaction ${dto.reference} updated to ${dto.status}`,
// // //       transaction: updatedTransaction,
// // //     };
// // //   }
// // // }

// // // ---------------
// // import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// // import { PrismaService } from '../prisma/prisma.service';

// // @Injectable()
// // export class TransactionsService {
// //   constructor(private prisma: PrismaService) {}

// //   // নতুন ট্রানজেকশন তৈরি (টিনেন্ট আইসোলেশন সহ)
// //   async createTransaction(
// //     dto: {
// //       amount: number;
// //       currency?: string;
// //       reference: string;
// //       merchantId: string;
// //       status?: 'SUCCESS' | 'PENDING' | 'FAILED';
// //     },
// //     tenantId: string,
// //   ) {
// //     const merchant = await this.prisma.merchant.findFirst({
// //       where: {
// //         id: dto.merchantId,
// //         tenantId: tenantId,
// //       },
// //     });

// //     if (!merchant) {
// //       throw new NotFoundException('Merchant not found or does not belong to this tenant');
// //     }

// //     const existingTx = await this.prisma.transaction.findUnique({
// //       where: { reference: dto.reference },
// //     });

// //     if (existingTx) {
// //       throw new BadRequestException('Transaction with this reference already exists');
// //     }

// //     const transaction = await this.prisma.transaction.create({
// //       data: {
// //         amount: dto.amount,
// //         currency: dto.currency || 'BDT',
// //         status: dto.status || 'PENDING',
// //         reference: dto.reference,
// //         merchantId: dto.merchantId,
// //       },
// //     });

// //     return {
// //       message: 'Transaction processed successfully',
// //       transaction,
// //     };
// //   }

// //   // নির্দিষ্ট টিনেন্টের ট্রানজেকশন লিস্ট ও ফিল্টারিং
// //   async getTransactionsByTenant(
// //     tenantId: string,
// //     status?: 'SUCCESS' | 'PENDING' | 'FAILED',
// //     merchantId?: string,
// //   ) {
// //     return this.prisma.transaction.findMany({
// //       where: {
// //         merchant: {
// //           tenantId: tenantId,
// //         },
// //         ...(status && { status }),
// //         ...(merchantId && { merchantId }),
// //       },
// //       include: {
// //         merchant: {
// //           select: { id: true, name: true, email: true },
// //         },
// //       },
// //       orderBy: { createdAt: 'desc' },
// //     });
// //   }

// //   // ট্রানজেকশনের স্ট্যাটাস আপডেট করা
// //   async updateTransactionStatus(transactionId: string, status: 'SUCCESS' | 'PENDING' | 'FAILED') {
// //     const transaction = await this.prisma.transaction.findUnique({
// //       where: { id: transactionId },
// //     });

// //     if (!transaction) {
// //       throw new NotFoundException('Transaction not found');
// //     }

// //     const updatedTransaction = await this.prisma.transaction.update({
// //       where: { id: transactionId },
// //       data: { status },
// //     });

// //     return {
// //       message: `Transaction status updated to ${status} successfully`,
// //       transaction: updatedTransaction,
// //     };
// //   }

// //   // পেমেন্ট গেটওয়ে ওয়েবহুক হ্যান্ডেল করা
// //   async handlePaymentWebhook(dto: { reference: string; status: 'SUCCESS' | 'PENDING' | 'FAILED' }) {
// //     const transaction = await this.prisma.transaction.findUnique({
// //       where: { reference: dto.reference },
// //     });

// //     if (!transaction) {
// //       throw new BadRequestException('Transaction reference not found');
// //     }

// //     const updatedTransaction = await this.prisma.transaction.update({
// //       where: { id: transaction.id },
// //       data: { status: dto.status },
// //     });

// //     return {
// //       success: true,
// //       message: `Webhook processed. Transaction ${dto.reference} updated to ${dto.status}`,
// //       transaction: updatedTransaction,
// //     };
// //   }
// // }

// // -------------------

// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { NotificationsService } from '../notifications/notifications.service';
// import { MailService } from '../mail/mail.service';

// @Injectable()
// export class TransactionsService {
//   constructor(
//     private prisma: PrismaService,
//     private notificationsService: NotificationsService, // ২. এখানে ইনজেক্ট করুন
//     private mailService: MailService, // ২. এখানে ইনজেক্ট করুন
//   ) {}

//   // নতুন ট্রানজেকশন তৈরি (টিনেন্ট আইসোলেশন সহ)
//   async createTransaction(
//     dto: {
//       amount: number;
//       currency?: string;
//       reference: string;
//       merchantId: string;
//       status?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | 'PROCESSING' | 'COMPLETED';
//     },
//     tenantId: string,
//   ) {
//     const merchant = await this.prisma.merchant.findFirst({
//       where: {
//         id: dto.merchantId,
//         tenantId: tenantId,
//       },
//     });

//     if (!merchant) {
//       throw new NotFoundException('Merchant not found or does not belong to this tenant');
//     }

//     const existingTx = await this.prisma.transaction.findUnique({
//       where: { reference: dto.reference },
//     });

//     if (existingTx) {
//       throw new BadRequestException('Transaction with this reference already exists');
//     }

//     const transaction = await this.prisma.transaction.create({
//       data: {
//         amount: dto.amount,
//         currency: dto.currency || 'BDT',
//         status: dto.status || 'PENDING',
//         reference: dto.reference,
//         merchantId: dto.merchantId,
//       },
//     });

//     return {
//       message: 'Transaction processed successfully',
//       transaction,
//     };
//   }

//   // নির্দিষ্ট টিনেন্টের ট্রানজেকশন লিস্ট ও ফিল্টারিং
//   async getTransactionsByTenant(
//     tenantId: string,
//     status?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'APPROVED' | 'REJECTED' | 'REFUNDED',
//     merchantId?: string,
//   ) {
//     return this.prisma.transaction.findMany({
//       where: {
//         merchant: {
//           tenantId: tenantId,
//         },
//         ...(status && { status }),
//         ...(merchantId && { merchantId }),
//       },
//       include: {
//         merchant: {
//           select: { id: true, name: true, email: true },
//         },
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   // ট্রানজেকশন অ্যাপ্রুভ করা
//   async approveTransaction(transactionId: string, tenantId: string) {
//     const transaction = await this.prisma.transaction.findFirst({
//       where: {
//         id: transactionId,
//         merchant: { tenantId },
//       },
//       include: { merchant: true }, // যদি মার্চেন্টের ইমেল প্রয়োজন হয়
//     });

//     if (!transaction) {
//       throw new NotFoundException('Transaction not found or does not belong to this tenant');
//     }

//     const updatedTransaction = await this.prisma.transaction.update({
//       where: { id: transactionId },
//       data: { status: 'SUCCESS' }, // অথবা APPROVED রাখতে চাইলে স্ট্রিং কাস্টমাইজ করতে পারো
//     });
//     // === এই কোডটি এখানে বসাতে হবে ===
//     await this.notificationsService.createNotification({
//       title: 'Transaction Approved',
//       message: `Transaction ${transaction.reference} has been approved successfully.`,
//       type: 'TRANSACTION',
//       tenantId: tenantId,
//     });
//     // ===================================
//     // === ইমেল নোটিফিকেশন কোড এখানে বসবে ===
//     // (ধরে নিচ্ছি আপনার মার্চেন্ট বা ইউজারের ইমেল ফিল্ড রয়েছে)
//     const userEmail = transaction.merchant?.email || 'admin@example.com'; 
//     await this.mailService.sendTransactionEmail(userEmail, transaction.reference, 'SUCCESS');
//     // ==========================================

//     return {
//       message: 'Transaction approved successfully',
//       transaction: updatedTransaction,
//     };
//   }

//   // ট্রানজেকশন রিজেক্ট করা
//   async rejectTransaction(transactionId: string, tenantId: string) {
//     const transaction = await this.prisma.transaction.findFirst({
//       where: {
//         id: transactionId,
//         merchant: { tenantId },
//       },
//     });

//     if (!transaction) {
//       throw new NotFoundException('Transaction not found or does not belong to this tenant');
//     }

//     const updatedTransaction = await this.prisma.transaction.update({
//       where: { id: transactionId },
//       data: { status: 'FAILED' },
//     });

//     return {
//       message: 'Transaction rejected successfully',
//       transaction: updatedTransaction,
//     };
//   }

//   // ট্রানজেকশন রিফান্ড করা
//   async refundTransaction(transactionId: string, tenantId: string) {
//     const transaction = await this.prisma.transaction.findFirst({
//       where: {
//         id: transactionId,
//         merchant: { tenantId },
//       },
//     });

//     if (!transaction) {
//       throw new NotFoundException('Transaction not found or does not belong to this tenant');
//     }

//     if (transaction.status !== 'SUCCESS') {
//       throw new BadRequestException('Only successful transactions can be refunded');
//     }

//     const updatedTransaction = await this.prisma.transaction.update({
//       where: { id: transactionId },
//       data: { status: 'REFUNDED' },
//     });

//     return {
//       message: 'Transaction refunded successfully',
//       transaction: updatedTransaction,
//     };
//   }

//   // পেমেন্ট গেটওয়ে ওয়েবহুক হ্যান্ডেল করা
//   async handlePaymentWebhook(dto: { reference: string; status: 'SUCCESS' | 'PENDING' | 'FAILED' }) {
//     const transaction = await this.prisma.transaction.findUnique({
//       where: { reference: dto.reference },
//     });

//     if (!transaction) {
//       throw new BadRequestException('Transaction reference not found');
//     }

//     const updatedTransaction = await this.prisma.transaction.update({
//       where: { id: transaction.id },
//       data: { status: dto.status },
//     });

//     return {
//       success: true,
//       message: `Webhook processed. Transaction ${dto.reference} updated to ${dto.status}`,
//       transaction: updatedTransaction,
//     };
//   }
// }
// ------------
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service'; // ১. অডিট লগ সার্ভিস ইম্পোর্ট করা

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private mailService: MailService,
    private auditLogsService: AuditLogsService, // ২. এখানে ইনজেক্ট করুন
  ) {}

  // নতুন ট্রানজেকশন তৈরি (টিনেন্ট আইসোলেশন সহ)
  async createTransaction(
    dto: {
      amount: number;
      currency?: string;
      reference: string;
      merchantId: string;
      paymentMethod?: string;
      status?: string;
    },
    tenantId: string,
    userId?: string,
  ) {
    const merchant = await this.prisma.merchant.findFirst({
      where: {
        id: dto.merchantId,
        tenantId: tenantId,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found or does not belong to this tenant');
    }

    const existingTx = await this.prisma.transaction.findUnique({
      where: { reference: dto.reference },
    });

    if (existingTx) {
      throw new BadRequestException('Transaction with this reference already exists');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        status: dto.status || 'PENDING',
        reference: dto.reference,
        paymentMethod: dto.paymentMethod || 'bKash',
        merchantId: dto.merchantId,
        createdById: userId || null,
      },
    });

    // ইন-অ্যাপ নোটিফিকেশন: Transaction Created
    await this.notificationsService.createNotification({
      title: 'Transaction Created',
      message: `Transaction ${transaction.reference} created for ${transaction.amount} ${transaction.currency}.`,
      type: 'TRANSACTION',
      tenantId: tenantId,
    });

    if (transaction.status === 'FAILED') {
      await this.notificationsService.createNotification({
        title: 'Transaction Failed',
        message: `Transaction ${transaction.reference} has failed.`,
        type: 'TRANSACTION',
        tenantId: tenantId,
      });
      const userEmail = merchant.email || 'admin@example.com';
      await this.mailService.sendTransactionEmail(userEmail, transaction.reference, 'FAILED');
    }

    return {
      message: 'Transaction processed successfully',
      transaction,
    };
  }

  // নির্দিষ্ট টিনেন্টের ট্রানজেকশন লিস্ট ও ফিল্টারিং
  async getTransactionsByTenant(
    tenantId: string,
    status?: string,
    merchantId?: string,
    paymentMethod?: string,
    search?: string,
  ) {
    const whereClause: any = {
      merchant: { tenantId },
    };

    if (status) whereClause.status = status;
    if (merchantId) whereClause.merchantId = merchantId;
    if (paymentMethod) whereClause.paymentMethod = paymentMethod;
    if (search) {
      whereClause.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { merchant: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.transaction.findMany({
      where: whereClause,
      include: {
        merchant: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ট্রানজেকশন অ্যাপ্রুভ করা
  async approveTransaction(transactionId: string, tenantId: string, userId?: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        merchant: { tenantId },
      },
      include: { merchant: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found or does not belong to this tenant');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'COMPLETED' },
    });

    // ইন-অ্যাপ নোটিফিকেশন
    await this.notificationsService.createNotification({
      title: 'Transaction Approved',
      message: `Transaction ${transaction.reference} has been approved successfully.`,
      type: 'TRANSACTION',
      tenantId: tenantId,
    });

    // ইমেল নোটিফিকেশন
    const userEmail = transaction.merchant?.email || 'admin@example.com'; 
    await this.mailService.sendTransactionEmail(userEmail, transaction.reference, 'COMPLETED');

    // অডিট লগ রেকর্ড করা
    if (userId) {
      await this.auditLogsService.createLog({
        action: 'TRANSACTION_APPROVED',
        userId: userId,
        tenantId: tenantId,
        details: `Transaction ${transaction.reference} was approved.`,
      });
    }

    return {
      message: 'Transaction approved successfully',
      transaction: updatedTransaction,
    };
  }

  // ট্রানজেকশন রিজেক্ট করা
  async rejectTransaction(transactionId: string, tenantId: string, userId?: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        merchant: { tenantId },
      },
      include: { merchant: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found or does not belong to this tenant');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'FAILED' },
    });

    // ইন-অ্যাপ নোটিফিকেশন: Transaction Failed
    await this.notificationsService.createNotification({
      title: 'Transaction Failed',
      message: `Transaction ${transaction.reference} has been rejected / failed.`,
      type: 'TRANSACTION',
      tenantId: tenantId,
    });

    // ইমেল নোটিফিকেশন: Status Updated
    const userEmail = transaction.merchant?.email || 'admin@example.com';
    await this.mailService.sendTransactionEmail(userEmail, transaction.reference, 'FAILED');

    // অডিট লগ রেকর্ড করা
    if (userId) {
      await this.auditLogsService.createLog({
        action: 'TRANSACTION_REJECTED',
        userId: userId,
        tenantId: tenantId,
        details: `Transaction ${transaction.reference} was rejected.`,
      });
    }

    return {
      message: 'Transaction rejected successfully',
      transaction: updatedTransaction,
    };
  }

  // ট্রানজেকশন রিফান্ড করা
  async refundTransaction(transactionId: string, tenantId: string, userId?: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        merchant: { tenantId },
      },
      include: { merchant: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found or does not belong to this tenant');
    }

    if (transaction.status !== 'SUCCESS' && transaction.status !== 'COMPLETED') {
      throw new BadRequestException('Only completed transactions can be refunded');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'REFUNDED' },
    });

    // ইন-অ্যাপ নোটিফিকেশন
    await this.notificationsService.createNotification({
      title: 'Transaction Refunded',
      message: `Transaction ${transaction.reference} has been refunded.`,
      type: 'TRANSACTION',
      tenantId: tenantId,
    });

    // ইমেল নোটিফিকেশন
    const userEmail = transaction.merchant?.email || 'admin@example.com';
    await this.mailService.sendTransactionEmail(userEmail, transaction.reference, 'REFUNDED');

    // অডিট লগ রেকর্ড করা
    if (userId) {
      await this.auditLogsService.createLog({
        action: 'TRANSACTION_REFUNDED',
        userId: userId,
        tenantId: tenantId,
        details: `Transaction ${transaction.reference} was refunded.`,
      });
    }

    return {
      message: 'Transaction refunded successfully',
      transaction: updatedTransaction,
    };
  }

  // পেমেন্ট গেটওয়ে ওয়েবহুক হ্যান্ডেল করা
  async handlePaymentWebhook(dto: { reference: string; status: 'SUCCESS' | 'COMPLETED' | 'PENDING' | 'FAILED' }) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { reference: dto.reference },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction reference not found');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: dto.status },
    });

    return {
      success: true,
      message: `Webhook processed. Transaction ${dto.reference} updated to ${dto.status}`,
      transaction: updatedTransaction,
    };
  }

  // ===== SUPER ADMIN GLOBAL TRANSACTIONS =====
  async getTransactionsGlobal(status?: string, merchantId?: string, paymentMethod?: string, search?: string) {
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (merchantId) whereClause.merchantId = merchantId;
    if (paymentMethod) whereClause.paymentMethod = paymentMethod;
    if (search) {
      whereClause.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { merchant: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.transaction.findMany({
      where: whereClause,
      include: {
        merchant: {
          include: {
            tenant: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}