import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // নতুন ট্রানজেকশন তৈরি বা ইনিশিয়েট করা
  async createTransaction(dto: { amount: number; currency?: string; merchantId: string }) {
    // মার্চেন্ট আছে কি না চেক করা
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: dto.merchantId },
    });

    if (!merchant) {
      throw new BadRequestException('Merchant not found');
    }

    // ইউনিক ট্রানজেকশন রেফারেন্স জেনারেট করা
    const reference = `TXN-${randomUUID().substring(0, 8).toUpperCase()}`;

    // ট্রানজেকশন ডাটাবেজে সংরক্ষণ করা
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        reference,
        merchantId: merchant.id,
        status: 'PENDING',
      },
    });

    return {
      message: 'Transaction initiated successfully',
      transaction,
    };
  }

  // নির্দিষ্ট মার্চেন্টের সব ট্রানজেকশন লিস্ট দেখা
  async getTransactionsByMerchant(merchantId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new BadRequestException('Merchant not found');
    }

    return this.prisma.transaction.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}