import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"Payment Platform" <${process.env.MAIL_FROM}>`,
      }as any, // এখানে as any যুক্ত করা হয়েছে যাতে টাইপ এরর না দেয়
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}