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
}
