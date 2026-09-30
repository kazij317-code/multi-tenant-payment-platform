// // // import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// // // import { PrismaService } from '../prisma/prisma.service';
// // // import * as bcrypt from 'bcrypt';
// // // import { Role } from '@prisma/client';

// // // @Injectable()
// // // export class UserService {
// // //   constructor(private prisma: PrismaService) {}

// // //   // নতুন ইউজার তৈরি (টিনেন্ট বা অ্যাডমিন কর্তৃক)
// // //   async createUser(dto: { email: string; password: role?: Role; tenantId: string }) {
// // //     const existingUser = await this.prisma.user.findUnique({
// // //       where: { email: dto.email },
// // //     });

// // //     if (existingUser) {
// // //       throw new BadRequestException('User with this email already exists');
// // //     }

// // //     const hashedPassword = await bcrypt.hash(dto.password, 10);

// // //     const user = await this.prisma.user.create({
// // //       data: {
// // //         email: dto.email,
// // //         passwordHash: hashedPassword, // তোমার Prisma স্কিমার ফিল্ডের নাম অনুযায়ী passwordHash ব্যবহার করা হলো
// // //         role: dto.role || Role.VIEWER,
// // //         tenantId: dto.tenantId,
// // //       },
// // //     });

// // //     return {
// // //       message: 'User created successfully',
// // //       user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
// // //     };
// // //   }

// // //   // সব ইউজারের তালিকা দেখা
// // //   async getAllUsers() {
// // //     return this.prisma.user.findMany({
// // //       select: {
// // //         id: true,
// // //         email: true,
// // //         role: true,
// // //         tenantId: true,
// // //         createdAt: true,
// // //       },
// // //     });
// // //   }

// // //   // নির্দিষ্ট ইউজার ডিলিট করা
// // //   async deleteUser(id: string) {
// // //     const user = await this.prisma.user.findUnique({ where: { id } });
// // //     if (!user) {
// // //       throw new NotFoundException('User not found');
// // //     }

// // //     await this.prisma.user.delete({ where: { id } });
// // //     return { message: 'User deleted successfully' };
// // //   }
// // // }

// // // ----------------
// // // import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// // // import { PrismaService } from '../prisma/prisma.service';
// // // import * as bcrypt from 'bcrypt';
// // // import { Role } from '@prisma/client';

// // // @Injectable()
// // // export class UserService {
// // //   constructor(private prisma: PrismaService) {}

// // //   // নতুন ইউজার তৈরি (টিনেন্ট বা অ্যাডমিন কর্তৃক)
// // //   async createUser(dto: { email: string; password: string; role?: Role; tenantId: string }) {
// // //     const existingUser = await this.prisma.user.findUnique({
// // //       where: { email: dto.email },
// // //     });

// // //     if (existingUser) {
// // //       throw new BadRequestException('User with this email already exists');
// // //     }

// // //     const hashedPassword = await bcrypt.hash(dto.password, 10);

// // //     const user = await this.prisma.user.create({
// // //       data: {
// // //         email: dto.email,
// // //         passwordHash: hashedPassword, // তোমার Prisma স্কিমার ফিল্ডের নাম অনুযায়ী passwordHash ব্যবহার করা হলো
// // //         role: dto.role || Role.VIEWER,
// // //         tenantId: dto.tenantId,
// // //       },
// // //     });

// // //     return {
// // //       message: 'User created successfully',
// // //       user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
// // //     };
// // //   }

// // //   // সব ইউজারের তালিকা দেখা
// // //   async getAllUsers() {
// // //     return this.prisma.user.findMany({
// // //       select: {
// // //         id: true,
// // //         email: true,
// // //         role: true,
// // //         tenantId: true,
// // //         createdAt: true,
// // //       },
// // //     });
// // //   }

// // //   // নির্দিষ্ট ইউজার ডিলিট করা
// // //   async deleteUser(id: string) {
// // //     const user = await this.prisma.user.findUnique({ where: { id } });
// // //     if (!user) {
// // //       throw new NotFoundException('User not found');
// // //     }

// // //     await this.prisma.user.delete({ where: { id } });
// // //     return { message: 'User deleted successfully' };
// // //   }
// // // }

// // // ---------------------

// // // import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// // // import { PrismaService } from '../prisma/prisma.service';
// // // import * as bcrypt from 'bcrypt';
// // // import { Role } from '@prisma/client';
// // // import { AuditLogsService } from '../audit-logs/audit-logs.service'; // অডিট লগ সার্ভিস ইম্পোর্ট করো

// // // @Injectable()
// // // export class UserService {
// // //   constructor(
// // //     private prisma: PrismaService,
// // //     private auditLogsService: AuditLogsService, // এখানে ইনজেক্ট করো
// // //   ) {}

// // //   // নতুন ইউজার তৈরি (টিনেন্ট বা অ্যাডমিন কর্তৃক)
// // //   async createUser(dto: { email: string; password: string; role?: Role; tenantId: string }, currentUserId?: string) {
// // //     const existingUser = await this.prisma.user.findUnique({
// // //       where: { email: dto.email },
// // //     });

// // //     if (existingUser) {
// // //       throw new BadRequestException('User with this email already exists');
// // //     }

// // //     const hashedPassword = await bcrypt.hash(dto.password, 10);

// // //     const user = await this.prisma.user.create({
// // //       data: {
// // //         email: dto.email,
// // //         passwordHash: hashedPassword,
// // //         role: dto.role || Role.VIEWER,
// // //         tenantId: dto.tenantId,
// // //       },
// // //     });

// // //     // সফলভাবে ইউজার তৈরির পর স্বয়ংক্রিয়ভাবে অডিট লগ সেভ করা
// // //     await this.auditLogsService.createLog({
// // //       action: 'USER_CREATED',
// // //       userId: currentUserId || user.id, // রিকোয়েস্ট করা ইউজারের আইডি অথবা নতুন ইউজারের আইডি
// // //       tenantId: dto.tenantId,
// // //       details: `User created with email: ${user.email} and role: ${user.role}`,
// // //     });

// // //     return {
// // //       message: 'User created successfully',
// // //       user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
// // //     };
// // //   }

// // //   // সব ইউজারের তালিকা দেখা
// // //   async getAllUsers() {
// // //     return this.prisma.user.findMany({
// // //       select: {
// // //         id: true,
// // //         email: true,
// // //         role: true,
// // //         tenantId: true,
// // //         createdAt: true,
// // //       },
// // //     });
// // //   }

// // //   // নির্দিষ্ট ইউজার ডিলিট করা
// // //   async deleteUser(id: string) {
// // //     const user = await this.prisma.user.findUnique({ where: { id } });
// // //     if (!user) {
// // //       throw new NotFoundException('User not found');
// // //     }

// // //     await this.prisma.user.delete({ where: { id } });
// // //     return { message: 'User deleted successfully' };
// // //   }
// // // }

// // // --------------------
// // // import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// // // import { PrismaService } from '../prisma/prisma.service';
// // // import * as bcrypt from 'bcrypt';
// // // import { Role } from '@prisma/client';
// // // import { AuditLogsService } from '../audit-logs/audit-logs.service';

// // // @Injectable()
// // // export class UsersService {
// // //   constructor(
// // //     private prisma: PrismaService,
// // //     private auditLogsService: AuditLogsService,
// // //   ) {}

// // //   // নির্দিষ্ট টিনেন্টের অধীনে নতুন ইউজার তৈরি
// // //   async createUser(
// // //     dto: { email: string; password: string; name?: string; role?: Role },
// // //     tenantId: string,
// // //     currentUserId?: string,
// // //   ) {
// // //     const existingUser = await this.prisma.user.findUnique({
// // //       where: { email: dto.email },
// // //     });

// // //     if (existingUser) {
// // //       throw new BadRequestException('User with this email already exists');
// // //     }

// // //     const hashedPassword = await bcrypt.hash(dto.password, 10);

// // //     const user = await this.prisma.user.create({
// // //       data: {
// // //         email: dto.email,
// // //         passwordHash: hashedPassword,
// // //         name: dto.name,
// // //         role: dto.role || Role.VIEWER,
// // //         tenantId: tenantId,
// // //       },
// // //     });

// // //     // অডিট লগ সেভ করা
// // //     await this.auditLogsService.createLog({
// // //       action: 'USER_CREATED',
// // //       userId: currentUserId || user.id,
// // //       tenantId: tenantId,
// // //       details: `User created with email: ${user.email} and role: ${user.role}`,
// // //     });

// // //     const { passwordHash, ...result } = user;
// // //     return {
// // //       message: 'User created successfully',
// // //       user: result,
// // //     };
// // //   }

// // //   // নির্দিষ্ট টিনেন্টের সব ইউজারের তালিকা দেখা
// // //   async getUsersByTenant(tenantId: string) {
// // //     return this.prisma.user.findMany({
// // //       where: { tenantId },
// // //       select: {
// // //         id: true,
// // //         email: true,
// // //         name: true,
// // //         role: true,
// // //         tenantId: true,
// // //         createdAt: true,
// // //       },
// // //     });
// // //   }

// // //   // নির্দিষ্ট ইউজার ডিলিট করা (শুধু নিজের টিনেন্টের ভেতরে)
// // //   async deleteUser(id: string, tenantId: string) {
// // //     const user = await this.prisma.user.findFirst({
// // //       where: { id, tenantId },
// // //     });

// // //     if (!user) {
// // //       throw new NotFoundException('User not found or does not belong to this tenant');
// // //     }

// // //     await this.prisma.user.delete({ where: { id } });
// // //     return { message: 'User deleted successfully' };
// // //   }
// // // }

// // // ------------------------
// // import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// // import { PrismaService } from '../prisma/prisma.service';
// // import * as bcrypt from 'bcrypt';
// // import { Role } from '@prisma/client';
// // import { AuditLogsService } from '../audit-logs/audit-logs.service';

// // @Injectable()
// // export class UsersService {
// //   constructor(
// //     private prisma: PrismaService,
// //     private auditLogsService: AuditLogsService,
// //   ) {}

// //   // নির্দিষ্ট টিনেন্টের অধীনে নতুন ইউজার তৈরি
// //   async createUser(
// //     dto: { email: string; password: string; role?: Role },
// //     tenantId: string,
// //     currentUserId?: string,
// //   ) {
// //     const existingUser = await this.prisma.user.findUnique({
// //       where: { email: dto.email },
// //     });

// //     if (existingUser) {
// //       throw new BadRequestException('User with this email already exists');
// //     }

// //     const hashedPassword = await bcrypt.hash(dto.password, 10);

// //     const user = await this.prisma.user.create({
// //       data: {
// //         email: dto.email,
// //         passwordHash: hashedPassword,
// //         role: dto.role || Role.VIEWER,
// //         tenantId: tenantId,
// //       },
// //     });

// //     // অডিট লগ সেভ করা
// //     await this.auditLogsService.createLog({
// //       action: 'USER_CREATED',
// //       userId: currentUserId || user.id,
// //       tenantId: tenantId,
// //       details: `User created with email: ${user.email} and role: ${user.role}`,
// //     });

// //     const { passwordHash, ...result } = user;
// //     return {
// //       message: 'User created successfully',
// //       user: result,
// //     };
// //   }

// //   // নির্দিষ্ট টিনেন্টের সব ইউজারের তালিকা দেখা
// //   async getUsersByTenant(tenantId: string) {
// //     return this.prisma.user.findMany({
// //       where: { tenantId },
// //       select: {
// //         id: true,
// //         email: true,
// //         role: true,
// //         tenantId: true,
// //         createdAt: true,
// //       },
// //     });
// //   }

// //   // নির্দিষ্ট ইউজার ডিলিট করা
// //   async deleteUser(id: string, tenantId: string) {
// //     const user = await this.prisma.user.findFirst({
// //       where: { id, tenantId },
// //     });

// //     if (!user) {
// //       throw new NotFoundException('User not found or does not belong to this tenant');
// //     }

// //     await this.prisma.user.delete({ where: { id } });
// //     return { message: 'User deleted successfully' };
// //   }
// // }

// // --------------------
// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import * as bcrypt from 'bcrypt';
// import { Role } from '@prisma/client';
// import { AuditLogsService } from '../audit-logs/audit-logs.service';

// @Injectable()
// export class UsersService {
//   constructor(
//     private prisma: PrismaService,
//     private auditLogsService: AuditLogsService,
//   ) {}

//   // নির্দিষ্ট টিনেন্টের অধীনে নতুন ইউজার তৈরি
//   async createUser(
//     dto: { email: string; password: string; name?: string; role?: Role },
//     tenantId: string,
//     currentUserId?: string,
//   ) {
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
//         passwordHash: hashedPassword,
//         name: dto.name,
//         role: dto.role || Role.VIEWER,
//         tenantId: tenantId,
//       },
//     });

//     // অডিট লগ সেভ করা
//     await this.auditLogsService.createLog({
//       action: 'USER_CREATED',
//       userId: currentUserId || user.id,
//       tenantId: tenantId,
//       details: `User created with email: ${user.email} and role: ${user.role}`,
//     });

//     const { passwordHash, ...result } = user;
//     return {
//       message: 'User created successfully',
//       user: result,
//     };
//   }

//   // পেজিনেশন ও সার্চ সহ নির্দিষ্ট টিনেন্টের সব ইউজারের তালিকা দেখা
//   async getUsersByTenant(tenantId: string, page: number = 1, limit: number = 10, search?: string) {
//     const skip = (page - 1) * limit;

//     const whereClause: any = { tenantId };

//     if (search) {
//       whereClause.OR = [
//         { email: { contains: search, mode: 'insensitive' } },
//         { name: { contains: search, mode: 'insensitive' } },
//       ];
//     }

//     const [users, total] = await Promise.all([
//       this.prisma.user.findMany({
//         where: whereClause,
//         skip,
//         take: limit,
//         select: {
//           id: true,
//           email: true,
//           name: true,
//           role: true,
//           tenantId: true,
//           createdAt: true,
//         },
//         orderBy: { createdAt: 'desc' },
//       }),
//       this.prisma.user.count({ where: whereClause }),
//     ]);

//     return {
//       data: users,
//       meta: {
//         total,
//         page,
//         lastPage: Math.ceil(total / limit),
//         limit,
//       },
//     };
//   }

//   // ইউজার আপডেট বা রোল পরিবর্তন করা
//   async updateUser(
//     userId: string,
//     dto: { name?: string; email?: string; role?: Role },
//     tenantId: string,
//   ) {
//     const user = await this.prisma.user.findFirst({
//       where: { id: userId, tenantId },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found or does not belong to this tenant');
//     }

//     const updatedUser = await this.prisma.user.update({
//       where: { id: userId },
//       data: dto,
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         updatedAt: true,
//       },
//     });

//     return {
//       message: 'User updated successfully',
//       user: updatedUser,
//     };
//   }

//   // নির্দিষ্ট ইউজার ডিলিট করা
//   async deleteUser(id: string, tenantId: string) {
//     const user = await this.prisma.user.findFirst({
//       where: { id, tenantId },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found or does not belong to this tenant');
//     }

//     await this.prisma.user.delete({ where: { id } });
//     return { message: 'User deleted successfully' };
//   }
// }

// ------------
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
    private notificationsService: NotificationsService,
  ) {}

  // নির্দিষ্ট টিনেন্টের অধীনে নতুন ইউজার তৈরি
  async createUser(
    dto: { email: string; password: string; role?: Role },
    tenantId: string,
    currentUserId?: string,
  ) {
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
        tenantId: tenantId,
      },
    });

    // অডিট লগ সেভ করা
    await this.auditLogsService.createLog({
      action: 'USER_CREATED',
      userId: currentUserId || user.id,
      tenantId: tenantId,
      details: `User created with email: ${user.email} and role: ${user.role}`,
    });

    // ইন-অ্যাপ নোটিফিকেশন তৈরি
    await this.notificationsService.createNotification({
      title: 'User Created',
      message: `New user ${user.email} with role ${user.role} has been created.`,
      type: 'USER',
      tenantId: tenantId,
    });

    const { passwordHash, ...result } = user;
    return {
      message: 'User created successfully',
      user: result,
    };
  }

  // পেজিনেশন ও সার্চ সহ নির্দিষ্ট টিনেন্টের সব ইউজারের তালিকা দেখা (এখানে name বাদ দেওয়া হয়েছে)
  async getUsersByTenant(tenantId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const whereClause: any = { tenantId };

    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          tenantId: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: whereClause }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // ইউজার আপডেট বা রোল পরিবর্তন করা
  async updateUser(
    userId: string,
    dto: { email?: string; role?: Role },
    tenantId: string,
    currentUserId?: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found or does not belong to this tenant');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    if (currentUserId) {
      await this.auditLogsService.createLog({
        action: 'USER_UPDATED',
        userId: currentUserId,
        tenantId: tenantId,
        details: `User ${updatedUser.email} updated (Role: ${updatedUser.role}).`,
      });
    }

    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // নির্দিষ্ট ইউজার ডিলিট করা
  async deleteUser(id: string, tenantId: string, currentUserId?: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found or does not belong to this tenant');
    }

    await this.prisma.user.delete({ where: { id } });

    if (currentUserId) {
      await this.auditLogsService.createLog({
        action: 'USER_DELETED',
        userId: currentUserId,
        tenantId: tenantId,
        details: `User ${user.email} deleted.`,
      });
    }

    return { message: 'User deleted successfully' };
  }

  // ===== SUPER ADMIN GLOBAL USER MANAGEMENT =====
  async getAllUsersGlobal(search?: string) {
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRoleGlobal(userId: string, role: Role, currentUserId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (currentUserId) {
      await this.auditLogsService.createLog({
        action: 'SUPERADMIN_USER_ROLE_UPDATED',
        userId: currentUserId,
        tenantId: user.tenantId,
        details: `Global User ${updated.email} role changed to ${role}.`,
      });
    }

    return { message: 'User role updated successfully', user: updated };
  }

  async toggleUserActiveGlobal(userId: string, isActive: boolean, currentUserId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (currentUserId) {
      await this.auditLogsService.createLog({
        action: isActive ? 'SUPERADMIN_USER_UNBLOCKED' : 'SUPERADMIN_USER_BLOCKED',
        userId: currentUserId,
        tenantId: user.tenantId,
        details: `Global User ${updated.email} account ${isActive ? 'unblocked' : 'blocked'}.`,
      });
    }

    return {
      message: `User account ${isActive ? 'activated' : 'blocked'} successfully`,
      user: updated,
    };
  }
}