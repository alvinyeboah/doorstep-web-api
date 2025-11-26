import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlunkService } from './plunk.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private plunkService: PlunkService,
  ) {}

  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      await this.plunkService.sendEmail({
        to: email,
        from: this.configService.get<string>('EMAIL_FROM'),
        subject: 'DoorStep - Email Verification',
        body: `
          <h2>Email Verification</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `,
        name: 'DoorStep',
      });
      this.logger.log(`OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.plunkService.sendEmail({
        to: email,
        from: this.configService.get<string>('EMAIL_FROM'),
        subject: 'Welcome to DoorStep!',
        body: `
          <h2>Welcome to DoorStep, ${name}!</h2>
          <p>Thank you for joining our campus food delivery platform.</p>
          <p>Get started by completing your profile setup.</p>
        `,
        name: 'DoorStep',
      });
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
    }
  }
}
