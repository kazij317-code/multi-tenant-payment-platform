import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // @Global দেওয়ায় পুরো প্রজেক্টে এই সার্ভিসটি বারবার import করা লাগবে না
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}