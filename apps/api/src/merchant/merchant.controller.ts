// import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
// import { MerchantService } from './merchant.service';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('merchants')
// @UseGuards(AuthGuard('jwt')) // প্রোটেক্টেড রাউট (লগইন করা ছাড়া যাবে না)
// export class MerchantController {
//   constructor(private merchantService: MerchantService) {}

//   @Post()
//   async create(@Body() body: { name: string; email: string; tenantSlug: string }) {
//     return this.merchantService.createMerchant(body);
//   }

//   @Get(':tenantSlug')
//   async findAll(@Param('tenantSlug') tenantSlug: string) {
//     return this.merchantService.getMerchantsByTenant(tenantSlug);
//   }
// }

// --------------------
import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('merchants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async create(@Body() body: { name: string; email: string }, @Req() req: any) {
    const tenantId = req.user.tenantId; // জেসন টোকেন থেকে টিনেন্ট আইডি নেওয়া হচ্ছে
    return this.merchantService.createMerchant(body, tenantId);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
  async findAll(@Req() req: any) {
    const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া হচ্ছে
    return this.merchantService.getMerchantsByTenant(tenantId);
  }
}