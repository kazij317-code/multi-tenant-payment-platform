// import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//   ) {}

//   async register(dto: { email: string; password: string; tenantSlug: string }) {
//     // টিনেন্ট খুঁজে বের করা
//     const tenant = await this.prisma.tenant.findUnique({
//       where: { slug: dto.tenantSlug },
//     });

//     if (!tenant) {
//       throw new BadRequestException('Tenant not found');
//     }

//     // পাসওয়ার্ড হ্যাশ করা
//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     // ইউজার তৈরি করা
//     const user = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         passwordHash: hashedPassword,
//         tenantId: tenant.id,
//       },
//     });

//     return {
//       message: 'User registered successfully',
//       userId: user.id,
//       email: user.email,
//     };
//   }
// // নতুন লগইন মেথড
//   async login(dto: { email: string; password: string; tenantSlug: string }) {
//     // ১. টিনেন্ট খুঁজে বের করা
//     const tenant = await this.prisma.tenant.findUnique({
//       where: { slug: dto.tenantSlug },
//     });

//     if (!tenant) {
//       throw new BadRequestException('Tenant not found');
//     }

//     // ২. ওই টিনেন্টের অধীনে ইউজার আছে কি না চেক করা
//     const user = await this.prisma.user.findFirst({
//       where: {
//         email: dto.email,
//         tenantId: tenant.id,
//       },
//     });

//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // ৩. পাসওয়ার্ড ম্যাচ করে কি না দেখা
//     const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // ৪. JWT টোকেন জেনারেট করা
//    const payload = { 
//   sub: user.id, 
//   email: user.email, 
//   tenantId: tenant.id, 
//   role: user.role // এই রোলটি যোগ করতে হবে
// };
//     const accessToken = await this.jwtService.signAsync(payload, {
//       secret: 'SUPER_SECRET_KEY_HERE', // পরবর্তীতে আমরা এটি .env ফাইলে সরিয়ে নেব
//       expiresIn: '1d',
//     });

//     return {
//       message: 'Login successful',
//       accessToken,
//     };
//   }
// }

// -----------------
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service'; // আপনার প্রজেক্টের পাথ অনুযায়ী ঠিক করে নেবেন
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService, // MailService ইঞ্জেক্ট করা হলো
    private auditLogsService: AuditLogsService,
  ) {}

  // টোকেন জেনারেট করার হেল্পার মেথড
  async getTokens(userId: string, email: string, tenantId: string, role: string) {
    const payload = { sub: userId, email, tenantId, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_HERE',
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY_HERE',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // রিফ্রেশ টোকেন হাশ করে ডাটাবেজে আপডেট করা
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }

  async register(dto: { email: string; password: string; tenantSlug: string }) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        tenantId: tenant.id,
      },
    });

    await this.auditLogsService.createLog({
      action: 'USER_REGISTERED',
      userId: user.id,
      tenantId: tenant.id,
      details: `User ${user.email} registered.`,
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
      email: user.email,
    };
  }

  // লগইন মেথড (টোকেন পেয়ার জেনারেট করবে)
  async login(dto: { email: string; password: string; tenantSlug: string }) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        tenantId: tenant.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, tenant.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this.auditLogsService.createLog({
      action: 'USER_LOGIN',
      userId: user.id,
      tenantId: tenant.id,
      details: `User ${user.email} logged in.`,
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: tenant.id,
      },
      ...tokens,
    };
  }

  // নতুন অ্যাক্সেস টোকেন পাওয়ার জন্য রিফ্রেশ টোকেন ভ্যালিডেশন
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Access Denied');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.tenantId, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // লগআউট (রিফ্রেশ টোকেন রিমুভ করা)
  async logout(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });

    if (user) {
      await this.auditLogsService.createLog({
        action: 'USER_LOGOUT',
        userId: user.id,
        tenantId: user.tenantId,
        details: `User ${user.email} logged out.`,
      });
    }

    return { message: 'Logged out successfully' };
  }

  // পাসওয়ার্ড ভুলে যাওয়ার রিকোয়েস্ট (মকড)
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User with this email not found');
    }

    // একটি সাময়িক রিসেট টোকেন জেনারেট করা যেতে পারে
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_HERE', expiresIn: '15m' },
    );

    // MailService ব্যবহার করে রিয়েল ইমেল পাঠানো
    await this.mailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Password reset instructions sent to your email successfully.' };
  }

  // // পাসওয়ার্ড রিসেট করা
  // async resetPassword(dto: { email: string; newPassword: string }) {
  //   const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
  //   if (!user) throw new BadRequestException('User not found');

  //   const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
  //   await this.prisma.user.update({
  //     where: { email: dto.email },
  //     data: { passwordHash: hashedPassword },
  //   });

  //   return { message: 'Password reset successfully' };
  // }
  // পাসওয়ার্ড রিসেট করা
  async resetPassword(dto: { email: string; password?: string; newPassword?: string }) {
    const passwordToSet = dto.newPassword || dto.password;
    
    if (!dto.email || !passwordToSet) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new BadRequestException('User not found');

    const hashedPassword = await bcrypt.hash(passwordToSet, 10);
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Password reset successfully' };
  }
}
