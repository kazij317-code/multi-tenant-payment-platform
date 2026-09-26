import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
  async getSummary(@Req() req: any) {
    const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া
    return this.reportsService.getTransactionSummary(tenantId);
  }
}
