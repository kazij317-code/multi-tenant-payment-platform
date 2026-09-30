// // import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
// // import { UserService } from './users.service';
// // import { AuthGuard } from '@nestjs/passport';
// // import { RolesGuard } from '../auth/guards/roles.guard';
// // import { Roles } from '../auth/decorators/roles.decorator';
// // import { Role } from '@prisma/client';

// // @Controller('users')
// // @UseGuards(AuthGuard('jwt'), RolesGuard) // সব রাউটে JWT এবং Roles গার্ড একসঙ্গে কাজ করবে
// // export class UserController {
// //   constructor(private readonly userService: UserService) {}

// //   // শুধু SUPER_ADMIN অথবা TENANT_ADMIN নতুন ইউজার তৈরি করতে পারবে
// //   @Post()
// //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
// //   async createUser(
// //     @Body() body: { email: string; password: string; role?: Role; tenantId: string },
// //   ) {
// //     return this.userService.createUser(body);
// //   }

// //   // সব ইউজারের লিস্ট দেখা
// //   @Get()
// //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
// //   async getAllUsers() {
// //     return this.userService.getAllUsers();
// //   }

// //   // নির্দিষ্ট ইউজার ডিলিট করা
// //   @Delete(':id')
// //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
// //   async deleteUser(@Param('id') id: string) {
// //     return this.userService.deleteUser(id);
// //   }
// // }

// // -------------
// import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Role } from '@prisma/client';

// @Controller('users')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Post()
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
//   async createUser(
//     @Body() body: { email: string; 
//       password: string; 
//       // name?: string; 
//       role?: Role },
//     @Req() req: any,
//   ) {
//     const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া হচ্ছে
//     const currentUserId = req.user.userId || req.user.sub;
//     return this.usersService.createUser(body, tenantId, currentUserId);
//   }

//   @Get()
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
//   async getAllUsers(@Req() req: any) {
//     const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া হচ্ছে
//     return this.usersService.getUsersByTenant(tenantId);
//   }

//   @Delete(':id')
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
//   async deleteUser(@Param('id') id: string, @Req() req: any) {
//     const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া হচ্ছে
//     return this.usersService.deleteUser(id, tenantId);
//   }
// }

// ------------------

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async createUser(
    @Body() body: { email: string; password: string; name?: string; role?: Role },
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const currentUserId = req.user.userId || req.user.sub;
    return this.usersService.createUser(body, tenantId, currentUserId);
  }

  // সার্চ ও পেজিনেশন সহ সব ইউজারের লিস্ট দেখা
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Req() req?: any,
  ) {
    const tenantId = req.user.tenantId;
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.usersService.getUsersByTenant(tenantId, pageNum, limitNum, search);
  }

  // ইউজার আপডেট বা রোল পরিবর্তন করা
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; role?: Role },
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const currentUserId = req.user.userId || req.user.sub || req.user.id;
    return this.usersService.updateUser(id, body, tenantId, currentUserId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const currentUserId = req.user.userId || req.user.sub || req.user.id;
    return this.usersService.deleteUser(id, tenantId, currentUserId);
  }
}