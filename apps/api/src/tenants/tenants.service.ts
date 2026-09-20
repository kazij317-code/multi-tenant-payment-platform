import { Injectable } from '@nestjs/common';
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
      },
    });
  }

  // সব টিনেন্ট লিস্ট দেখার মেথড
  async getAllTenants() {
    return this.prisma.tenant.findMany({
      include: {
        users: true, // টিনেন্টের সাথে যুক্ত ইউজারদের তথ্যসহ দেখাবে
      },
    });
  }
}