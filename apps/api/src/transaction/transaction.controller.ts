// import { Controller, Post, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
// import { TransactionService } from './transaction.service';
// import { AuthGuard } from '@nestjs/passport';
// import { UpdateStatusDto } from './dto/update-status.dto'; // ১. DTO ইমপোর্ট করো
// import { WebhookDto } from './dto/webhook.dto'; // DTO ইমপোর্ট করো

// @Controller('transactions')
// @UseGuards(AuthGuard('jwt')) // সিকিউরড রাউট
// export class TransactionController {
//   constructor(private transactionService: TransactionService) {}

//   @Post()
//   async create(@Body() body: { amount: number; currency?: string; merchantId: string }) {
//     return this.transactionService.createTransaction(body);
//   }

//   @Get('merchant/:merchantId')
//   async findAll(@Param('merchantId') merchantId: string) {
//     return this.transactionService.getTransactionsByMerchant(merchantId);
//   }

//   @Patch(':id/status')
//   async updateStatus(
//     @Param('id') id: string,
//     @Body() dto: UpdateStatusDto, // ২. এখানে body-র পরিবর্তে DTO ব্যবহার করা হলো
//   ) {
//     return this.transactionService.updateTransactionStatus(id, dto.status);
//   }

// // (কন্ট্রোলারের ভেতরে অন্যান্য মেথডগুলোর নিচে এটি যোগ করো)

//   @Post('webhook')
//   async paymentWebhook(@Body() dto: WebhookDto) {
//     return this.transactionService.handlePaymentWebhook(dto);
//   }
// }

// ---------------------

import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateStatusDto } from './dto/update-status.dto';
import { WebhookDto } from './dto/webhook.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // ১. ওয়েবহুক রাউটটি সবার উপরে থাকবে এবং এর আগে কোনো UseGuards থাকবে না (পাবলিক রাউট)
  @Post('webhook')
  async paymentWebhook(@Body() dto: WebhookDto) {
    return this.transactionService.handlePaymentWebhook(dto);
  }

  // ২. বাকি রাউটগুলোতে সিকিউরিটি গার্ড থাকবে
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() body: { amount: number; currency?: string; merchantId: string }) {
    return this.transactionService.createTransaction(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('merchant/:merchantId')
  async findAll(@Param('merchantId') merchantId: string) {
    return this.transactionService.getTransactionsByMerchant(merchantId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.transactionService.updateTransactionStatus(id, dto.status);
  }
}