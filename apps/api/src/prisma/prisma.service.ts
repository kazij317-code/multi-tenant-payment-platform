import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // যখন NestJS অ্যাপ স্টার্ট হবে, তখন ডাটাবেস কানেকশন এস্টাবলিশ করবে
    await this.$connect();
  }

  async onModuleDestroy() {
    // যখন অ্যাপ বন্ধ হয়ে যাবে, তখন কানেকশন সেফলি ক্লোজ করবে
    await this.$disconnect();
  }
}

