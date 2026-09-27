import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('merchants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async create(@Body() body: { name: string; email: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.merchantsService.createMerchant(body, tenantId);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
  async findAll(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.merchantsService.getMerchantsByTenant(tenantId);
  }
}
