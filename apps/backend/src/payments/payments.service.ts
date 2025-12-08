import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  InitializePaymentDto,
  VerifyPaymentDto,
  InitializeStepperDepositDto,
} from './dto/payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.paystackSecretKey =
      this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
    if (!this.paystackSecretKey) {
      this.logger.warn(
        'PAYSTACK_SECRET_KEY is not configured. Payment features will not work.',
      );
    }
  }

  /**
   * Initialize a payment transaction
   * Documentation: https://paystack.com/docs/payments/accept-payments/
   */
  async initializePayment(dto: InitializePaymentDto) {
    if (!this.paystackSecretKey) {
      throw new BadRequestException(
        'Payment service is not configured. Please contact support.',
      );
    }

    try {
      const reference =
        dto.reference || `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await fetch(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: dto.email,
            amount: dto.amount, // Amount in kobo
            reference,
            currency: 'GHS', // Ghana Cedis
            metadata: dto.metadata || {},
            callback_url: this.configService.get<string>(
              'PAYSTACK_CALLBACK_URL',
            ),
          }),
        },
      );

      const data = await response.json();

      if (!data.status) {
        this.logger.error('Paystack initialization failed', data);
        throw new BadRequestException(
          data.message || 'Failed to initialize payment',
        );
      }

      return {
        status: true,
        message: 'Payment initialized successfully',
        data: {
          authorization_url: data.data.authorization_url,
          access_code: data.data.access_code,
          reference: data.data.reference,
        },
      };
    } catch (error: any) {
      this.logger.error('Error initializing payment', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to initialize payment',
      );
    }
  }

  /**
   * Verify a payment transaction
   * Documentation: https://paystack.com/docs/payments/verify-payments/
   */
  async verifyPayment(dto: VerifyPaymentDto) {
    if (!this.paystackSecretKey) {
      throw new BadRequestException(
        'Payment service is not configured. Please contact support.',
      );
    }

    try {
      const response = await fetch(
        `${this.paystackBaseUrl}/transaction/verify/${dto.reference}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (!data.status) {
        this.logger.error('Paystack verification failed', data);
        throw new BadRequestException(
          data.message || 'Failed to verify payment',
        );
      }

      return {
        status: true,
        message: 'Payment verified successfully',
        data: {
          reference: data.data.reference,
          amount: data.data.amount / 100, // Convert from kobo to cedis
          currency: data.data.currency,
          status: data.data.status,
          paid_at: data.data.paid_at,
          customer: data.data.customer,
          metadata: data.data.metadata,
        },
      };
    } catch (error: any) {
      this.logger.error('Error verifying payment', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to verify payment',
      );
    }
  }

  /**
   * Initialize stepper security deposit payment (GHC 1000)
   */
  async initializeStepperDeposit(userId: string, dto: InitializeStepperDepositDto) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
      include: { wallet: true },
    });

    if (!stepper) {
      throw new BadRequestException('Stepper profile not found');
    }

    if (stepper.wallet && stepper.wallet.depositAmount >= 1000) {
      throw new BadRequestException('Security deposit already paid');
    }

    // GHC 1000 = 100000 pesewas (kobo equivalent)
    const amount = 100000; // GHC 1000 in pesewas

    const paymentData = await this.initializePayment({
      amount,
      email: dto.email,
      reference: `DEPOSIT_${stepper.id}_${Date.now()}`,
      metadata: {
        type: 'stepper_deposit',
        stepperId: stepper.id,
        userId,
        amount: 1000, // GHC 1000
      },
    });

    return {
      ...paymentData,
      message: 'Security deposit payment initialized. Amount: GHC 1000',
    };
  }

  /**
   * Handle Paystack webhook events
   * Documentation: https://paystack.com/docs/payments/webhooks/
   */
  async handleWebhook(signature: string, payload: any) {
    const paystackSecret = this.paystackSecretKey;

    if (!paystackSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', paystackSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      this.logger.error('Invalid webhook signature');
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = payload.event;
    const data = payload.data;

    this.logger.log(`Received webhook event: ${event}`);

    try {
      switch (event) {
        case 'charge.success':
          await this.handleSuccessfulPayment(data);
          break;

        case 'charge.failed':
          this.logger.warn(`Payment failed: ${data.reference}`);
          break;

        default:
          this.logger.log(`Unhandled webhook event: ${event}`);
      }

      return { status: true, message: 'Webhook processed successfully' };
    } catch (error: any) {
      this.logger.error('Error processing webhook', error);
      throw new InternalServerErrorException('Failed to process webhook');
    }
  }

  /**
   * Handle successful payment from webhook
   */
  private async handleSuccessfulPayment(data: any) {
    const reference = data.reference;
    const amount = data.amount / 100; // Convert from pesewas to cedis
    const metadata = data.metadata;

    this.logger.log(`Processing successful payment: ${reference}`);

    // Handle stepper deposit
    if (metadata.type === 'stepper_deposit') {
      const stepperId = metadata.stepperId;

      // Update stepper wallet with deposit
      await this.prisma.wallet.update({
        where: { stepperId },
        data: {
          depositAmount: 1000,
          balance: { increment: 1000 },
          investmentStartDate: new Date(),
          lastGrowthUpdate: new Date(),
        },
      });

      this.logger.log(`Stepper deposit credited: ${stepperId} - GHC 1000`);
    }

    // Handle order payment
    if (metadata.type === 'order_payment') {
      const orderId = metadata.orderId;

      // Update order as paid
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          // Add a 'paid' field to your Order model if needed
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Order payment confirmed: ${orderId} - GHC ${amount}`);
    }
  }
}
