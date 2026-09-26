import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
  async create(@Body() body: { amount: number; currency?: string; reference: string; merchantId: string; status?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.transactionsService.createTransaction(body, tenantId);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
  async findAll(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.transactionsService.getTransactionsByTenant(tenantId);
  }
}
