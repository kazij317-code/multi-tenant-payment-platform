import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTransactionEmail(to: string, transactionReference: string, status: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `Transaction Status Update: ${status}`,
        text: `Hello, your transaction with reference ${transactionReference} has been updated to status: ${status}.`,
        html: `<b>Hello,</b><br>Your transaction with reference <b>${transactionReference}</b> has been updated to status: <b>${status}</b>.`,
      });
    } catch (error) {
      console.error('Failed to send transaction email:', error);
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }
}