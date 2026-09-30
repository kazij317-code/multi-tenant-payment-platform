import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ReportsModule } from './reports/reports.module';
import { TransactionsModule } from './transactions/transactions.module';
import { MerchantsModule } from './merchants/merchants.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { SystemConfigModule } from './system-config/system-config.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // ১ মিনিট (৬০,০০০ মি.সে.)
        limit: 100, // ১ মিনিটে সর্বোচ্চ ১০০টি রিকোয়েস্ট
      },
    ]),
    PrismaModule, TenantsModule, AuthModule, MerchantsModule, TransactionsModule, UsersModule, AuditLogsModule, ReportsModule, PaymentsModule, WebhooksModule, NotificationsModule, MailModule, ApiKeysModule, SystemConfigModule], // এখানে যুক্ত করো
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // গ্লোবালি সমস্ত এন্ডপয়েন্টে এটি কাজ করবে
    },
    AppService],
})
export class AppModule {}