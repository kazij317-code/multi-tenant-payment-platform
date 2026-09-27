import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // নির্দিষ্ট টিনেন্টের নোটিফিকেশন লিস্ট দেখার এন্ডপয়েন্ট
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
  async findAll(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.notificationsService.getNotificationsByTenant(tenantId);
  }

  // নোটিফিকেশন রিড করার এন্ডপয়েন্ট
  @Patch(':id/read')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.notificationsService.markAsRead(id, tenantId);
  }
}
