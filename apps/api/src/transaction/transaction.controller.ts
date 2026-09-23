import { Controller, Post, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateStatusDto } from './dto/update-status.dto'; // ১. DTO ইমপোর্ট করো

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

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto, // ২. এখানে body-র পরিবর্তে DTO ব্যবহার করা হলো
  ) {
    return this.transactionService.updateTransactionStatus(id, dto.status);
  }
}