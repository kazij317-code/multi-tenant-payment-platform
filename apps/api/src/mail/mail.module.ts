import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER || 'kazij317@gmail.com',
          pass: process.env.MAIL_PASSWORD || 'yyzeetowehlnrbxm',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: `"Payment Platform" <${process.env.MAIL_FROM || process.env.MAIL_USER || 'kazij317@gmail.com'}>`,
      },
    } as any),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}