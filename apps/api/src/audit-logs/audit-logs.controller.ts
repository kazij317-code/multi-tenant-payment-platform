import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('global')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get global audit logs across all tenants (Super Admin only)' })
  async getGlobalLogs() {
    return this.auditLogsService.getAllLogs();
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get audit logs for tenant' })
  async getLogs(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.auditLogsService.getLogsByTenant(tenantId);
  }
}
