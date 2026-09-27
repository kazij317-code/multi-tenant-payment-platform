// import { Module } from '@nestjs/common';
// import { UserController } from './users.controller';
// import { UserService } from './users.service';
// import { PrismaModule } from '../prisma/prisma.module';
// import { AuditLogsModule } from '../audit-logs/audit-logs.module'; // এটি ইম্পোর্ট করো

// @Module({
//   imports: [PrismaModule, AuditLogsModule], // এখানে যুক্ত করো
//   controllers: [UserController],
//   providers: [UserService],
// })
// export class UserModule {}


// ---------------

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [PrismaModule, AuditLogsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}