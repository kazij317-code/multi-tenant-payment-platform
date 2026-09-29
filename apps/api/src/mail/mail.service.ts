import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTransactionEmail(to: string, transactionReference: string, status: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Transaction Status Update: ${status}`,
      text: `Hello, your transaction with reference ${transactionReference} has been updated to status: ${status}.`,
      html: `<b>Hello,</b><br>Your transaction with reference <b>${transactionReference}</b> has been updated to status: <b>${status}</b>.`,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
  }
}