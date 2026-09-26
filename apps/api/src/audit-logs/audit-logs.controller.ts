import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async getLogs(@Req() req: any) {
    const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া
    return this.auditLogsService.getLogsByTenant(tenantId);
  }
}
