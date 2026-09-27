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

@Module({
  imports: [PrismaModule, TenantsModule, AuthModule, MerchantsModule, TransactionsModule, UsersModule, AuditLogsModule, ReportsModule, TransactionsModule, MerchantsModule, PaymentsModule, WebhooksModule, NotificationsModule, MailModule], // এখানে যুক্ত করো
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}