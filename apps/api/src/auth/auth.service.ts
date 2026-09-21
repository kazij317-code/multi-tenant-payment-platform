import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
}
