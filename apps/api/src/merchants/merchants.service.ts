// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class MerchantsService {
//   constructor(private prisma: PrismaService) {}

//   // নতুন মার্চেন্ট তৈরি (নির্দিষ্ট টিনেন্টের অধীনে)
//   async createMerchant(dto: { name: string; email: string }, tenantId: string) {
//     return this.prisma.merchant.create({
//       data: {
//         name: dto.name,
//         email: dto.email,
//         tenantId: tenantId,
//         status: 'ACTIVE',
//       },
//     });
//   }

//   // নির্দিষ্ট টিনেন্টের সব মার্চেন্টের তালিকা দেখা
//   async getMerchantsByTenant(tenantId: string) {
//     return this.prisma.merchant.findMany({
//       where: { tenantId },
//       include: {
//         _count: {
//           select: { transactions: true },
//         },
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//   }
// }

// --------------

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  // নতুন মার্চেন্ট তৈরি (নির্দিষ্ট টিনেন্টের অধীনে)
  async createMerchant(dto: { name: string; email: string }, tenantId: string) {
    const merchant = await this.prisma.merchant.create({
      data: {
        name: dto.name,
        email: dto.email,
        tenantId: tenantId,
        status: 'ACTIVE',
      },
    });

    return {
      message: 'Merchant created successfully',
      merchant,
    };
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

  // মার্চেন্ট আপডেট করা
  async updateMerchant(
    id: string,
    dto: { name?: string; email?: string; status?: string },
    tenantId: string,
  ) {
    const merchant = await this.prisma.merchant.findFirst({
      where: { id, tenantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found or does not belong to this tenant');
    }

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Merchant updated successfully',
      merchant: updatedMerchant,
    };
  }

  // মার্চেন্ট অ্যাক্টিভ বা সাসপেন্ড করা
  async toggleMerchantStatus(id: string, status: string, tenantId: string) {
    const merchant = await this.prisma.merchant.findFirst({
      where: { id, tenantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found or does not belong to this tenant');
    }

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id },
      data: { status },
    });

    return {
      message: `Merchant status updated to ${status} successfully`,
      merchant: updatedMerchant,
    };
  }
}