import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('System Config')
@ApiBearerAuth()
@Controller('system-config')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.OPERATOR, Role.VIEWER)
  @ApiOperation({ summary: 'Get global system configuration' })
  async getConfig() {
    return this.configService.getConfig();
  }

  @Patch()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update global system configuration (Super Admin only)' })
  async updateConfig(
    @Body()
    body: {
      defaultCurrency?: string;
      platformFeePercentage?: number;
      enableBkash?: boolean;
      enableNagad?: boolean;
      enableStripe?: boolean;
      maxLoginAttempts?: number;
      sessionTimeoutMinutes?: number;
      require2FA?: boolean;
      maintenanceMode?: boolean;
    },
  ) {
    return this.configService.updateConfig(body);
  }
}
