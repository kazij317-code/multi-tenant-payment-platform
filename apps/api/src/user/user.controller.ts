import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // সব রাউটে JWT এবং Roles গার্ড একসঙ্গে কাজ করবে
export class UserController {
  constructor(private readonly userService: UserService) {}

  // শুধু SUPER_ADMIN অথবা TENANT_ADMIN নতুন ইউজার তৈরি করতে পারবে
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async createUser(
    @Body() body: { email: string; password: string; role?: Role; tenantId: string },
  ) {
    return this.userService.createUser(body);
  }

  // সব ইউজারের লিস্ট দেখা
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // নির্দিষ্ট ইউজার ডিলিট করা
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}