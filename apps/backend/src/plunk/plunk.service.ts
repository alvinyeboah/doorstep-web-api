import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlunkService {
  private readonly logger = new Logger(PlunkService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('PLUNK_API_KEY')!;
    const baseUrl = this.configService.get<string>('PLUNK_BASE_URL');

    // For self-hosted, the endpoint is /api/v1/send
    // The SDK should append /send to the base URL
    if (baseUrl && baseUrl.includes('mail.alvinyeboah.com')) {
      this.baseUrl = 'https://mail.alvinyeboah.com/api/v1';
    } else {
      this.baseUrl = baseUrl || 'https://api.useplunk.com/v1';
    }

    this.logger.log(`PlunkService initialized with baseUrl: ${this.baseUrl}`);
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    body: string;
    from?: string;
    name?: string;
    subscribed?: boolean;
    reply?: string;
    headers?: Record<string, any>;
    attachments?: any[];
  }): Promise<{ success: boolean; emails?: any[]; message?: string }> {
    try {
      const sendUrl = `${this.baseUrl}/send`;

      // Set default sender name
      if (!data.name) {
        data.name = 'DoorStep';
      }

      // Always subscribe to marketing unless explicitly set to false
      if (data.subscribed === undefined) {
        data.subscribed = true;
      }

      this.logger.debug(`[PlunkService] Sending email to: ${sendUrl}`);
      this.logger.debug(
        `[PlunkService] Request data:`,
        JSON.stringify(
          {
            to: data.to,
            subject: data.subject,
            bodyLength: data.body.length,
            from: data.from,
            name: data.name,
            subscribed: data.subscribed,
          },
          null,
          2,
        ),
      );

      const response = await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[PlunkService] HTTP Error:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      this.logger.debug(
        `[PlunkService] Response:`,
        JSON.stringify(responseData, null, 2),
      );

      return responseData;
    } catch (error) {
      this.logger.error('[PlunkService] Send failed with exception:', error);
      throw error;
    }
  }

  /**
   * Send 2FA code for withdrawal verification
   */
  async send2FACode(email: string, code: string, amount: number) {
    const subject = 'DoorStep - Withdrawal Verification Code';
    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Withdrawal Verification</h2>
          <p>You have requested to withdraw <strong>GHC ${amount.toFixed(2)}</strong> from your DoorStep wallet.</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you did not request this withdrawal, please contact support immediately.</p>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
    });
  }

  /**
   * Send email verification code for new users
   */
  async sendVerificationCode(email: string, code: string, name: string) {
    const subject = 'DoorStep - Verify Your Email';
    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to DoorStep, ${name}!</h2>
          <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you did not create this account, please ignore this email.</p>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
    });
  }

  /**
   * Send order status update notification
   */
  async sendOrderStatusUpdate(
    email: string,
    orderId: string,
    status: string,
    customerName: string,
  ) {
    const subject = `DoorStep - Order ${status}`;
    const statusMessages: Record<string, string> = {
      PLACED: 'Your order has been placed successfully!',
      ACCEPTED: 'Your order has been accepted by the vendor.',
      PREPARING: 'Your order is being prepared.',
      READY: 'Your order is ready for pickup!',
      OUT_FOR_DELIVERY: 'Your order is out for delivery.',
      DELIVERED: 'Your order has been delivered!',
      COMPLETED: 'Your order is complete. Thank you!',
      CANCELLED: 'Your order has been cancelled.',
    };

    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Order Update</h2>
          <p>Hi ${customerName},</p>
          <p>${statusMessages[status] || `Your order status has been updated to: ${status}`}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p>Track your order in the DoorStep app for real-time updates.</p>
          <p style="color: #6b7280; font-size: 14px;">Thank you for using DoorStep!</p>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
    });
  }

  /**
   * Send welcome email to new stepper
   */
  async sendStepperWelcome(email: string, name: string) {
    const subject = 'Welcome to DoorStep Delivery Team!';
    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to the DoorStep Delivery Team!</h2>
          <p>Hi ${name},</p>
          <p>Congratulations on joining DoorStep as a delivery stepper!</p>
          <h3>Next Steps:</h3>
          <ol>
            <li>Complete your profile with all required documents</li>
            <li>Pay the GHC 1000 security deposit (invested in mutual fund, earning 8% annual returns)</li>
            <li>Wait for admin verification</li>
            <li>Start earning 80% commission on every delivery!</li>
          </ol>
          <p>Your security deposit will be invested and grow at 8% annually. You can withdraw your earnings anytime.</p>
          <p style="color: #6b7280; font-size: 14px;">If you have any questions, contact our support team.</p>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
    });
  }
}
