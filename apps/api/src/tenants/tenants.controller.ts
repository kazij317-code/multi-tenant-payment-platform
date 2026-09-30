import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new tenant (Super Admin only)' })
  async create(@Body() body: { name: string; slug: string }) {
    return this.tenantsService.createTenant(body.name, body.slug);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all tenants list (Super Admin only)' })
  async findAll() {
    return this.tenantsService.getAllTenants();
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update tenant status ACTIVE/SUSPENDED (Super Admin only)' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.tenantsService.updateTenantStatus(id, body.status);
  }
}