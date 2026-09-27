import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  // গেটওয়ে থেকে আসা ওয়েবহুক রিকোয়েস্ট হ্যান্ডেল করা
  async handleGatewayWebhook(dto: {
    reference: string;
    status: 'SUCCESS' | 'FAILED';
    gatewayTransactionId?: string;
  }) {
    // ১. ট্রানজেকশন রেফারেন্স দিয়ে ডাটাবেজ থেকে ট্রানজেকশন খোঁজা
    const transaction = await this.prisma.transaction.findUnique({
      where: { reference: dto.reference },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found with this reference');
    }

    // ২. ট্রানজেকশনের স্ট্যাটাস আপডেট করা
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: dto.status, // পেমেন্ট সফল হলে SUCCESS বা ব্যর্থ হলে FAILED
      },
    });

    return {
      message: 'Webhook processed successfully, transaction status updated',
      transaction: updatedTransaction,
    };
  }
}
