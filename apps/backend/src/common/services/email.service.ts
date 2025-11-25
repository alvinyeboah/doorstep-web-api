import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to: email,
        subject: 'DoorStep - Email Verification',
        html: `
          <h2>Email Verification</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `,
      });
      this.logger.log(`OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to: email,
        subject: 'Welcome to DoorStep!',
        html: `
          <h2>Welcome to DoorStep, ${name}!</h2>
          <p>Thank you for joining our campus food delivery platform.</p>
          <p>Get started by completing your profile setup.</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
    }
  }
}
