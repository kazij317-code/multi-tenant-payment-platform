import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  // নতুন লগ ক্রিয়েট করার ফাংশন
  async createLog(data: { action: string; userId: string; tenantId: string; details?: string }) {
    return this.prisma.auditLog.create({
      data,
    });
  }

  // নির্দিষ্ট টিনেন্টের সব অডিট লগ দেখার ফাংশন
  async getLogsByTenant(tenantId: string) {
    return this.prisma.auditLog.findMany({
      where: { tenantId },
      include: { tenant: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // সব টিনেন্টের গ্লোবাল অডিট লগ (সুপার অ্যাডমিনদের জন্য)
  async getAllLogs() {
    return this.prisma.auditLog.findMany({
      include: { tenant: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}