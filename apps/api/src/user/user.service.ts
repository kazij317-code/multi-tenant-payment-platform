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
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // নতুন ইউজার তৈরি (টিনেন্ট বা অ্যাডমিন কর্তৃক)
  async createUser(dto: { email: string; password: string; role?: Role; tenantId: string }) {
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
        passwordHash: hashedPassword, // তোমার Prisma স্কিমার ফিল্ডের নাম অনুযায়ী passwordHash ব্যবহার করা হলো
        role: dto.role || Role.VIEWER,
        tenantId: dto.tenantId,
      },
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