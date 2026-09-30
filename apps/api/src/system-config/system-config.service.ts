import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemConfigService {
  constructor(private prisma: PrismaService) {}

  // গ্লোবাল সিস্টেম কনফিগারেশন পান (না থাকলে অটো ডিফল্ট রো ক্রিয়েট হবে)
  async getConfig() {
    let config = await this.prisma.systemConfig.findUnique({
      where: { id: 'global' },
    });

    if (!config) {
      config = await this.prisma.systemConfig.create({
        data: {
          id: 'global',
          defaultCurrency: 'BDT',
          platformFeePercentage: 1.5,
          enableBkash: true,
          enableNagad: true,
          enableStripe: true,
          maxLoginAttempts: 5,
          sessionTimeoutMinutes: 60,
          require2FA: false,
          maintenanceMode: false,
        },
      });
    }

    return config;
  }

  // সুপার অ্যাডমিন কর্তৃক গ্লোবাল কনফিগারেশন আপডেট
  async updateConfig(dto: {
    defaultCurrency?: string;
    platformFeePercentage?: number;
    enableBkash?: boolean;
    enableNagad?: boolean;
    enableStripe?: boolean;
    maxLoginAttempts?: number;
    sessionTimeoutMinutes?: number;
    require2FA?: boolean;
    maintenanceMode?: boolean;
  }) {
    // নিশ্চিত হওয়া যে global রোটি আগে থেকেই আছে
    await this.getConfig();

    return this.prisma.systemConfig.update({
      where: { id: 'global' },
      data: dto,
    });
  }
}
