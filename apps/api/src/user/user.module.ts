import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module'; // এটি ইম্পোর্ট করো

@Module({
  imports: [PrismaModule, AuditLogsModule], // এখানে যুক্ত করো
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}