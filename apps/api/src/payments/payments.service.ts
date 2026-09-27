import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // পেমেন্ট ইনিশিয়েট বা গেটওয়ে সেশন তৈরি করা
  async initiatePayment(dto: { amount: number; currency?: string; merchantId: string; reference: string }, tenantId: string) {
    // ১. মার্চেন্ট টিনেন্টের অধীনে আছে কি না যাচাই করা
    const merchant = await this.prisma.merchant.findFirst({
      where: {
        id: dto.merchantId,
        tenantId: tenantId,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found or does not belong to this tenant');
    }

    // ২. ডাটাবেজে ট্রানজেকশনটি PENDING স্ট্যাটাসে সেভ করা
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        status: 'PENDING', // পেমেন্ট সম্পন্ন হওয়ার আগে পেন্ডিং থাকবে
        reference: dto.reference,
        merchantId: dto.merchantId,
      },
    });

    // ৩. পেমেন্ট গেটওয়ে থেকে একটি পেমেন্ট ইউআরএল বা গেমওয়ে রেসপন্স পাওয়ার সিমুলেশন
    // (রিয়েল গেটওয়েতে এখানে axios দিয়ে bKash/SSLCommerz API কল করা হবে)
    const gatewayResponse = {
      paymentUrl: `https://sandbox.paymentgateway.com/pay/${transaction.reference}`,
      gatewayTransactionId: `GW-${Math.random().toString(36).substring(7).toUpperCase()}`,
    };

    return {
      message: 'Payment session initiated successfully',
      transactionId: transaction.id,
      paymentUrl: gatewayResponse.paymentUrl,
      gatewayTransactionId: gatewayResponse.gatewayTransactionId,
    };
  }
}