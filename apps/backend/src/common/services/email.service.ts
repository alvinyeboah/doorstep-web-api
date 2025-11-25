import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UseSend } from 'usesend-js';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private usesend: UseSend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('USESEND_API_KEY');
    const baseUrl = this.configService.get<string>('USESEND_BASE_URL');

    // Initialize UseSend with API key and optional base URL for self-hosted instances
    this.usesend = baseUrl
      ? new UseSend(apiKey, baseUrl)
      : new UseSend(apiKey);
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      await this.usesend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: email,
        subject: 'DoorStep - Email Verification',
        html: `
          <h2>Email Verification</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `,
        text: `Email Verification\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      });
      this.logger.log(`OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.usesend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: email,
        subject: 'Welcome to DoorStep!',
        html: `
          <h2>Welcome to DoorStep, ${name}!</h2>
          <p>Thank you for joining our campus food delivery platform.</p>
          <p>Get started by completing your profile setup.</p>
        `,
        text: `Welcome to DoorStep, ${name}!\n\nThank you for joining our campus food delivery platform.\n\nGet started by completing your profile setup.`,
      });
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
    }
  }
}
