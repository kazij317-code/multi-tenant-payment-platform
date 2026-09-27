// // // import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
// // // import { TransactionsService } from './transactions.service';
// // // import { AuthGuard } from '@nestjs/passport';
// // // import { RolesGuard } from '../auth/guards/roles.guard';
// // // import { Roles } from '../auth/decorators/roles.decorator';
// // // import { Role } from '@prisma/client';

// // // @Controller('transactions')
// // // @UseGuards(AuthGuard('jwt'), RolesGuard)
// // // export class TransactionsController {
// // //   constructor(private readonly transactionsService: TransactionsService) {}

// // //   @Post()
// // //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
// // //   async create(@Body() body: { amount: number; currency?: string; reference: string; merchantId: string; status?: string }, @Req() req: any) {
// // //     const tenantId = req.user.tenantId;
// // //     return this.transactionsService.createTransaction(body, tenantId);
// // //   }

// // //   @Get()
// // //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
// // //   async findAll(@Req() req: any) {
// // //     const tenantId = req.user.tenantId;
// // //     return this.transactionsService.getTransactionsByTenant(tenantId);
// // //   }
// // // }

// // // -----------------
// // import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
// // import { TransactionsService } from './transactions.service';
// // import { AuthGuard } from '@nestjs/passport';
// // import { RolesGuard } from '../auth/guards/roles.guard';
// // import { Roles } from '../auth/decorators/roles.decorator';
// // import { Role, TransactionStatus } from '@prisma/client';

// // @Controller('transactions')
// // export class TransactionsController {
// //   constructor(private readonly transactionsService: TransactionsService) {}

// //   // ১. পাবলিক ওয়েবহুক রাউট (কোনো গার্ড থাকবে না)
// //   @Post('webhook')
// //   async paymentWebhook(@Body() dto: { reference: string; status: TransactionStatus }) {
// //     return this.transactionsService.handlePaymentWebhook(dto);
// //   }

// //   // ২. ট্রানজেকশন তৈরি রাউট (JWT ও RBAC গার্ড সহ)
// //   @UseGuards(AuthGuard('jwt'), RolesGuard)
// //   @Post()
// //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
// //   async create(
// //     @Body() body: { amount: number; currency?: string; reference: string; merchantId: string; status?: TransactionStatus },
// //     @Req() req: any,
// //   ) {
// //     const tenantId = req.user.tenantId;
// //     return this.transactionsService.createTransaction(body, tenantId);
// //   }

// //   // ৩. টিনেন্ট ভিত্তিক ট্রানজেকশন লিস্ট ও ফিল্টারিং রাউট (status এবং merchantId কুয়েরি সাপোর্ট করবে)
// //   @UseGuards(AuthGuard('jwt'), RolesGuard)
// //   @Get()
// //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
// //   async findAll(
// //     @Query('status') status?: TransactionStatus,
// //     @Query('merchantId') merchantId?: string,
// //     @Req() req?: any,
// //   ) {
// //     const tenantId = req.user.tenantId;
// //     return this.transactionsService.getTransactionsByTenant(tenantId, status, merchantId);
// //   }

// //   // ৪. স্ট্যাটাস আপডেট রাউট
// //   @UseGuards(AuthGuard('jwt'), RolesGuard)
// //   @Patch(':id/status')
// //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
// //   async updateStatus(
// //     @Param('id') id: string,
// //     @Body() body: { status: TransactionStatus },
// //   ) {
// //     return this.transactionsService.updateTransactionStatus(id, body.status);
// //   }
// // }

// // ----------------

// import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
// import { TransactionsService } from './transactions.service';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Role } from '@prisma/client';

// @Controller('transactions')
// export class TransactionsController {
//   constructor(private readonly transactionsService: TransactionsService) {}

//   @Post('webhook')
//   async paymentWebhook(@Body() dto: { reference: string; status: 'SUCCESS' | 'PENDING' | 'FAILED' }) {
//     return this.transactionsService.handlePaymentWebhook(dto);
//   }

//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Post()
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
//   async create(
//     @Body() body: { amount: number; currency?: string; reference: string; merchantId: string; status?: 'SUCCESS' | 'PENDING' | 'FAILED' },
//     @Req() req: any,
//   ) {
//     const tenantId = req.user.tenantId;
//     return this.transactionsService.createTransaction(body, tenantId);
//   }

//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Get()
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
//   async findAll(
//     @Query('status') status?: 'SUCCESS' | 'PENDING' | 'FAILED',
//     @Query('merchantId') merchantId?: string,
//     @Req() req?: any,
//   ) {
//     const tenantId = req.user.tenantId;
//     return this.transactionsService.getTransactionsByTenant(tenantId, status, merchantId);
//   }

//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Patch(':id/status')
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
//   async updateStatus(
//     @Param('id') id: string,
//     @Body() body: { status: 'SUCCESS' | 'PENDING' | 'FAILED' },
//   ) {
//     return this.transactionsService.updateTransactionStatus(id, body.status);
//   }
// }

// ----------------

import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('webhook')
  async paymentWebhook(@Body() dto: { reference: string; status: 'SUCCESS' | 'PENDING' | 'FAILED' }) {
    return this.transactionsService.handlePaymentWebhook(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
  async create(
    @Body() body: { amount: number; currency?: string; reference: string; merchantId: string; status?: any },
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.transactionsService.createTransaction(body, tenantId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.VIEWER)
  async findAll(
    @Query('status') status?: any,
    @Query('merchantId') merchantId?: string,
    @Req() req?: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.transactionsService.getTransactionsByTenant(tenantId, status, merchantId);
  }

  // ট্রানজেকশন অ্যাপ্রুভ রাউট
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/approve')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async approve(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.transactionsService.approveTransaction(id, tenantId);
  }

  // ট্রানজেকশন রিজেক্ট রাউট
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/reject')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async reject(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.transactionsService.rejectTransaction(id, tenantId);
  }

  // ট্রানজেকশন রিফান্ড রাউট
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/refund')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  async refund(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.transactionsService.refundTransaction(id, tenantId);
  }
}