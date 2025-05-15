import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendResetPasswordEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/auth/reset-password/${token}`; // Change to frontend reset URL
    const mailOptions = {
      from: `"DIU CSE Alumni" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Your Password',
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new InternalServerErrorException('Failed to send reset email');
    }
  }
}
