import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { MerchantModule } from './merchant/merchant.module'; // এটি ইমপোর্ট করো
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [PrismaModule, TenantsModule, AuthModule, MerchantModule, TransactionModule, UserModule, AuditLogsModule, ReportsModule], // এখানে যুক্ত করো
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}