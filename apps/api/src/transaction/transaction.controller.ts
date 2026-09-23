import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt')) // সিকিউরড রাউট
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async create(@Body() body: { amount: number; currency?: string; merchantId: string }) {
    return this.transactionService.createTransaction(body);
  }

  @Get('merchant/:merchantId')
  async findAll(@Param('merchantId') merchantId: string) {
    return this.transactionService.getTransactionsByMerchant(merchantId);
  }
}