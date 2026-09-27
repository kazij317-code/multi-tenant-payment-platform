import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // নতুন নোটিফিকেশন তৈরি করা (অন্যান্য সার্ভিস থেকে কল করার জন্য)
  async createNotification(dto: {
    title: string;
    message: string;
    type: string;
    tenantId: string;
  }) {
    return this.prisma.notification.create({
      data: {
        title: dto.title,
        message: dto.message,
        type: dto.type,
        tenantId: dto.tenantId,
      },
    });
  }

  // নির্দিষ্ট টিনেন্টের সব নোটিফিকেশন দেখা
  async getNotificationsByTenant(tenantId: string) {
    return this.prisma.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // নোটিফিকেশন রিড বা পঠিত হিসেবে মার্ক করা
  async markAsRead(notificationId: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, tenantId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found or access denied');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
