import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('gateway')
  async handleWebhook(
    @Body() body: { reference: string; status: 'SUCCESS' | 'FAILED'; gatewayTransactionId?: string },
  ) {
    return this.webhooksService.handleGatewayWebhook(body);
  }
}