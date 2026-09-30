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
    const logs = await this.prisma.auditLog.findMany({
      where: { tenantId },
      include: { tenant: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const userIds = Array.from(new Set(logs.map((l) => l.userId).filter(Boolean)));
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return logs.map((log) => ({
      ...log,
      user: userMap.get(log.userId) || { email: 'Unknown / System' },
    }));
  }

  // সব টিনেন্টের গ্লোবাল অডিট লগ (সুপার অ্যাডমিনদের জন্য)
  async getAllLogs() {
    const logs = await this.prisma.auditLog.findMany({
      include: { tenant: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const userIds = Array.from(new Set(logs.map((l) => l.userId).filter(Boolean)));
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return logs.map((log) => ({
      ...log,
      user: userMap.get(log.userId) || { email: 'Unknown / System' },
    }));
  }
}