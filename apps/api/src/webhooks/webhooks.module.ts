// import { Module } from '@nestjs/common';
// import { WebhooksController } from './webhooks.controller';
// import { WebhooksService } from './webhooks.service';
// import { WebhooksService } from './webhooks.service';
// import { WebhooksController } from './webhooks.controller';

// @Module({
//   controllers: [WebhooksController],
//   providers: [WebhooksService]
// })
// export class WebhooksModule {}

// ------------

import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}