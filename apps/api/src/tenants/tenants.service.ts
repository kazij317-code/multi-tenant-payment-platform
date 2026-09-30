import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  // নতুন টিনেন্ট তৈরি করার মেথড
  async createTenant(name: string, slug: string) {
    return this.prisma.tenant.create({
      data: {
        name,
        slug,
        status: 'ACTIVE',
      },
    });
  }

  // সব টিনেন্ট লিস্ট দেখার মেথড
  async getAllTenants() {
    return this.prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            merchants: true,
            auditLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // টিনেন্ট স্ট্যাটাস (ACTIVE / SUSPENDED) পরিবর্তন
  async updateTenantStatus(id: string, status: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return this.prisma.tenant.update({
      where: { id },
      data: { status },
    });
  }
}