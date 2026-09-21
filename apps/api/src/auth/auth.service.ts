import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: { email: string; password: string; tenantSlug: string }) {
    // টিনেন্ট খুঁজে বের করা
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // ইউজার তৈরি করা
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        tenantId: tenant.id,
      },
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
      email: user.email,
    };
  }
// নতুন লগইন মেথড
  async login(dto: { email: string; password: string; tenantSlug: string }) {
    // ১. টিনেন্ট খুঁজে বের করা
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    // ২. ওই টিনেন্টের অধীনে ইউজার আছে কি না চেক করা
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        tenantId: tenant.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ৩. পাসওয়ার্ড ম্যাচ করে কি না দেখা
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ৪. JWT টোকেন জেনারেট করা
    const payload = { sub: user.id, email: user.email, tenantId: tenant.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'SUPER_SECRET_KEY_HERE', // পরবর্তীতে আমরা এটি .env ফাইলে সরিয়ে নেব
      expiresIn: '1d',
    });

    return {
      message: 'Login successful',
      accessToken,
    };
  }
}

