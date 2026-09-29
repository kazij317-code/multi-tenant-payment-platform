import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api-keys')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async findAll(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.apiKeysService.getApiKeysByTenant(tenantId);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async create(@Body() body: { name: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.apiKeysService.createApiKey(tenantId, body.name);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async remove(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.apiKeysService.deleteApiKey(id, tenantId);
  }
}