import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('merchants')
@UseGuards(AuthGuard('jwt')) // প্রোটেক্টেড রাউট (লগইন করা ছাড়া যাবে না)
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Post()
  async create(@Body() body: { name: string; email: string; tenantSlug: string }) {
    return this.merchantService.createMerchant(body);
  }

  @Get(':tenantSlug')
  async findAll(@Param('tenantSlug') tenantSlug: string) {
    return this.merchantService.getMerchantsByTenant(tenantSlug);
  }
}