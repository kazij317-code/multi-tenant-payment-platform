import { Controller, Get, Post, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  async create(@Body() body: { name: string; slug: string }) {
    return this.tenantsService.createTenant(body.name, body.slug);
  }

  @Get()
  async findAll() {
    return this.tenantsService.getAllTenants();
  }
}