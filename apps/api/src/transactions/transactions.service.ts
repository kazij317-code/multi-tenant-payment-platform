import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // নতুন ট্রানজেকশন তৈরি বা প্রসেস করা
  async createTransaction(dto: {
    amount: number;
    currency?: string;
    reference: string;
    merchantId: string;
    status?: string;
  }, tenantId: string) {
    // ১. মার্চেন্টটি এই টিনেন্টের অধীনে আছে কি না যাচাই করা
    const merchant = await this.prisma.merchant.findFirst({
      where: {
        id: dto.merchantId,
        tenantId: tenantId,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found or does not belong to this tenant');
    }

    // ২. একই রেফারেন্সের ট্রানজেকশন আগে আছে কি না চেক করা
    const existingTx = await this.prisma.transaction.findUnique({
      where: { reference: dto.reference },
    });

    if (existingTx) {
      throw new BadRequestException('Transaction with this reference already exists');
    }

    // ৩. ট্রানজেকশন তৈরি করা
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        status: dto.status || 'SUCCESS', // টেস্টের জন্য ডিফল্ট SUCCESS রাখতে পারো
        reference: dto.reference,
        merchantId: dto.merchantId,
      },
    });

    return {
      message: 'Transaction processed successfully',
      transaction,
    };
  }

  // নির্দিষ্ট টিনেন্টের সব ট্রানজেকশন দেখা
  async getTransactionsByTenant(tenantId: string) {
    return this.prisma.transaction.findMany({
      where: {
        merchant: {
          tenantId: tenantId,
        },
      },
      include: {
        merchant: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
