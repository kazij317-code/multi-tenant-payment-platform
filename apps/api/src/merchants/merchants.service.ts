import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  // নতুন মার্চেন্ট তৈরি (নির্দিষ্ট টিনেন্টের অধীনে)
  async createMerchant(dto: { name: string; email: string }, tenantId: string) {
    return this.prisma.merchant.create({
      data: {
        name: dto.name,
        email: dto.email,
        tenantId: tenantId,
        status: 'ACTIVE',
      },
    });
  }

  // নির্দিষ্ট টিনেন্টের সব মার্চেন্টের তালিকা দেখা
  async getMerchantsByTenant(tenantId: string) {
    return this.prisma.merchant.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}