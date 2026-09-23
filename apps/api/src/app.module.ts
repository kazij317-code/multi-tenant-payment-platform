import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { MerchantModule } from './merchant/merchant.module'; // এটি ইমপোর্ট করো
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [PrismaModule, TenantsModule, AuthModule, MerchantModule, TransactionModule], // এখানে যুক্ত করো
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}