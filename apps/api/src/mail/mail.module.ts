import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.MAIL_PORT || '465', 10),
          secure: process.env.MAIL_PORT === '465' || !process.env.MAIL_PORT, // true for 465, false for other ports
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
        } as any,
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}