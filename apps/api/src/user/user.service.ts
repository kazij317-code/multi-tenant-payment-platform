// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import * as bcrypt from 'bcrypt';
// import { Role } from '@prisma/client';

// @Injectable()
// export class UserService {
//   constructor(private prisma: PrismaService) {}

//   // নতুন ইউজার তৈরি (টিনেন্ট বা অ্যাডমিন কর্তৃক)
//   async createUser(dto: { email: string; password: role?: Role; tenantId: string }) {
//     const existingUser = await this.prisma.user.findUnique({
//       where: { email: dto.email },
//     });

//     if (existingUser) {
//       throw new BadRequestException('User with this email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     const user = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         passwordHash: hashedPassword, // তোমার Prisma স্কিমার ফিল্ডের নাম অনুযায়ী passwordHash ব্যবহার করা হলো
//         role: dto.role || Role.VIEWER,
//         tenantId: dto.tenantId,
//       },
//     });

//     return {
//       message: 'User created successfully',
//       user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
//     };
//   }

//   // সব ইউজারের তালিকা দেখা
//   async getAllUsers() {
//     return this.prisma.user.findMany({
//       select: {
//         id: true,
//         email: true,
//         role: true,
//         tenantId: true,
//         createdAt: true,
//       },
//     });
//   }

//   // নির্দিষ্ট ইউজার ডিলিট করা
//   async deleteUser(id: string) {
//     const user = await this.prisma.user.findUnique({ where: { id } });
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     await this.prisma.user.delete({ where: { id } });
//     return { message: 'User deleted successfully' };
//   }
// }

// ----------------
// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import * as bcrypt from 'bcrypt';
// import { Role } from '@prisma/client';

// @Injectable()
// export class UserService {
//   constructor(private prisma: PrismaService) {}

//   // নতুন ইউজার তৈরি (টিনেন্ট বা অ্যাডমিন কর্তৃক)
//   async createUser(dto: { email: string; password: string; role?: Role; tenantId: string }) {
//     const existingUser = await this.prisma.user.findUnique({
//       where: { email: dto.email },
//     });

//     if (existingUser) {
//       throw new BadRequestException('User with this email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     const user = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         passwordHash: hashedPassword, // তোমার Prisma স্কিমার ফিল্ডের নাম অনুযায়ী passwordHash ব্যবহার করা হলো
//         role: dto.role || Role.VIEWER,
//         tenantId: dto.tenantId,
//       },
//     });

//     return {
//       message: 'User created successfully',
//       user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
//     };
//   }

//   // সব ইউজারের তালিকা দেখা
//   async getAllUsers() {
//     return this.prisma.user.findMany({
//       select: {
//         id: true,
//         email: true,
//         role: true,
//         tenantId: true,
//         createdAt: true,
//       },
//     });
//   }

//   // নির্দিষ্ট ইউজার ডিলিট করা
//   async deleteUser(id: string) {
//     const user = await this.prisma.user.findUnique({ where: { id } });
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     await this.prisma.user.delete({ where: { id } });
//     return { message: 'User deleted successfully' };
//   }
// }

// ---------------------

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service'; // অডিট লগ সার্ভিস ইম্পোর্ট করো

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService, // এখানে ইনজেক্ট করো
  ) {}

  // নতুন ইউজার তৈরি (টিনেন্ট বা অ্যাডমিন কর্তৃক)
  async createUser(dto: { email: string; password: string; role?: Role; tenantId: string }, currentUserId?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        role: dto.role || Role.VIEWER,
        tenantId: dto.tenantId,
      },
    });

    // সফলভাবে ইউজার তৈরির পর স্বয়ংক্রিয়ভাবে অডিট লগ সেভ করা
    await this.auditLogsService.createLog({
      action: 'USER_CREATED',
      userId: currentUserId || user.id, // রিকোয়েস্ট করা ইউজারের আইডি অথবা নতুন ইউজারের আইডি
      tenantId: dto.tenantId,
      details: `User created with email: ${user.email} and role: ${user.role}`,
    });

    return {
      message: 'User created successfully',
      user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
    };
  }

  // সব ইউজারের তালিকা দেখা
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });
  }

  // নির্দিষ্ট ইউজার ডিলিট করা
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}