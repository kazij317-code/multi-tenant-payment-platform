import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService) {}

  // নতুন মার্চেন্ট তৈরি করা
  async createMerchant(dto: { name: string; email: string; tenantSlug: string }) {
    // টিনেন্ট আছে কি না চেক করা
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    // মার্চেন্ট তৈরি করা
    const merchant = await this.prisma.merchant.create({
      data: {
        name: dto.name,
        email: dto.email,
        tenantId: tenant.id,
      },
    });

    return {
      message: 'Merchant created successfully',
      merchant,
    };
  }

  // নির্দিষ্ট টিনেন্টের সব মার্চেন্ট লিস্ট দেখা
  async getMerchantsByTenant(tenantSlug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    return this.prisma.merchant.findMany({
      where: { tenantId: tenant.id },
    });
  }
}