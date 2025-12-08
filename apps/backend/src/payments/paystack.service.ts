import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface PaystackTransactionRequest {
  amount: number; // Amount in kobo (smallest currency unit)
  email: string;
  reference?: string;
  currency?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

export interface PaystackMobileMoneyRequest {
  amount: number; // Amount in kobo (smallest currency unit)
  email: string;
  phone: string; // Customer's mobile money number
  reference?: string;
  currency?: string;
  metadata?: Record<string, any>;
  provider?: 'mtn' | 'tgo' | 'vod'; // MTN, AirtelTigo, Vodafone/Telecel
}

export interface PaystackMobileMoneyResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    status: string;
    display_text: string;
    // Other fields that Paystack might return
  };
}

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly paystackClient: AxiosInstance;
  private readonly secretKey: string;
  private readonly publicKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    // Secret key: sk_live_xxx or sk_test_xxx
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';

    // Public key: pk_live_xxx or pk_test_xxx
    this.publicKey =
      this.configService.get<string>('PAYSTACK_PUBLIC_KEY') ||
      this.configService.get<string>('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY') ||
      this.configService.get<string>('PAYSTACK_LIVE_KEY') ||
      '';

    this.baseUrl =
      this.configService.get<string>('PAYSTACK_BASE_URL') ||
      'https://api.paystack.co';

    if (!this.secretKey || !this.publicKey) {
      this.logger.warn(
        'Paystack configuration is missing - service will be disabled',
      );
      this.logger.warn(
        `Secret Key present: ${!!this.secretKey}, Public Key present: ${!!this.publicKey}`,
      );
    } else {
      this.logger.log('Paystack service configured successfully');
      this.logger.log(
        `Using ${this.publicKey.startsWith('pk_live_') ? 'LIVE' : 'TEST'} mode`,
      );
    }

    this.paystackClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.logger.log('Paystack service initialized');
  }

  async initializeTransaction(
    request: PaystackTransactionRequest,
  ): Promise<PaystackTransactionResponse> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      const payload = {
        amount: request.amount,
        email: request.email,
        reference: request.reference,
        currency: request.currency || 'GHS',
        callback_url: request.callback_url,
        metadata: request.metadata,
      };

      const response = await this.paystackClient.post(
        '/transaction/initialize',
        payload,
      );

      if (response.data.status) {
        this.logger.log(
          `Transaction initialized: ${response.data.data.reference}`,
        );
        return response.data;
      } else {
        throw new Error(
          response.data.message || 'Failed to initialize transaction',
        );
      }
    } catch (error) {
      this.logger.error('Paystack transaction initialization failed:', error);
      throw error;
    }
  }

  async verifyTransaction(
    reference: string,
  ): Promise<PaystackVerificationResponse> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      const response = await this.paystackClient.get(
        `/transaction/verify/${reference}`,
      );

      if (response.data.status) {
        this.logger.log(
          `Transaction verified: ${reference} - ${response.data.data.status}`,
        );
        return response.data;
      } else {
        throw new Error(
          response.data.message || 'Failed to verify transaction',
        );
      }
    } catch (error) {
      this.logger.error('Paystack transaction verification failed:', error);
      throw error;
    }
  }

  async getTransaction(
    reference: string,
  ): Promise<PaystackVerificationResponse> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      const response = await this.paystackClient.get(
        `/transaction/${reference}`,
      );

      if (response.data.status) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to get transaction');
      }
    } catch (error) {
      this.logger.error('Paystack get transaction failed:', error);
      throw error;
    }
  }

  async listTransactions(
    params: {
      perPage?: number;
      page?: number;
      customer?: number;
      status?: string;
      from?: string;
      to?: string;
    } = {},
  ): Promise<any> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      const response = await this.paystackClient.get('/transaction', {
        params,
      });

      if (response.data.status) {
        return response.data;
      } else {
        throw new Error(
          response.data.message || 'Failed to list transactions',
        );
      }
    } catch (error) {
      this.logger.error('Paystack list transactions failed:', error);
      throw error;
    }
  }

  async createCustomer(data: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      const response = await this.paystackClient.post('/customer', data);

      if (response.data.status) {
        this.logger.log(
          `Customer created: ${response.data.data.customer_code}`,
        );
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create customer');
      }
    } catch (error) {
      this.logger.error('Paystack create customer failed:', error);
      throw error;
    }
  }

  async getCustomer(customerCode: string): Promise<any> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      const response = await this.paystackClient.get(
        `/customer/${customerCode}`,
      );

      if (response.data.status) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to get customer');
      }
    } catch (error) {
      this.logger.error('Paystack get customer failed:', error);
      throw error;
    }
  }

  async refundTransaction(reference: string, amount?: number): Promise<any> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      const payload: any = { transaction: reference };
      if (amount) {
        payload.amount = amount;
      }

      const response = await this.paystackClient.post('/refund', payload);

      if (response.data.status) {
        this.logger.log(`Refund processed: ${response.data.data.reference}`);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to process refund');
      }
    } catch (error) {
      this.logger.error('Paystack refund failed:', error);
      throw error;
    }
  }

  /**
   * Charge mobile money directly (Ghana: MTN MoMo, Telecel Cash, AirtelTigo Money)
   * Customer will receive prompt on their phone to authorize payment
   */
  async chargeMobileMoney(
    request: PaystackMobileMoneyRequest,
  ): Promise<PaystackMobileMoneyResponse> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      // Format phone number (remove spaces, dashes, ensure correct format)
      const formattedPhone = request.phone.replace(/[\s-]/g, '');

      const payload = {
        email: request.email,
        amount: request.amount,
        reference: request.reference,
        currency: request.currency || 'GHS',
        metadata: request.metadata,
        mobile_money: {
          phone: formattedPhone,
          provider: request.provider || 'mtn', // Default to MTN if not specified
        },
      };

      const response = await this.paystackClient.post('/charge', payload);

      if (response.data.status) {
        this.logger.log(
          `Mobile money charge initiated: ${response.data.data.reference}`,
        );
        return response.data;
      } else {
        throw new Error(
          response.data.message || 'Failed to charge mobile money',
        );
      }
    } catch (error) {
      this.logger.error('Paystack mobile money charge failed:', error);
      throw error;
    }
  }

  /**
   * Initialize transaction for payment link (can be used for QR code generation)
   * Returns authorization_url which can be converted to QR code
   */
  async initializePaymentLink(
    request: PaystackTransactionRequest,
  ): Promise<PaystackTransactionResponse> {
    try {
      if (!this.secretKey) {
        throw new Error('Paystack secret key is missing');
      }

      // Generate unique reference if not provided
      const reference =
        request.reference ||
        `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const payload = {
        amount: request.amount,
        email: request.email,
        reference,
        currency: request.currency || 'GHS',
        callback_url: request.callback_url,
        metadata: {
          ...request.metadata,
          payment_type: 'in_person_qr',
        },
        channels: ['mobile_money', 'card', 'bank', 'ussd'], // Allow multiple payment methods
      };

      const response = await this.paystackClient.post(
        '/transaction/initialize',
        payload,
      );

      if (response.data.status) {
        this.logger.log(
          `Payment link initialized: ${response.data.data.reference}`,
        );
        return response.data;
      } else {
        throw new Error(
          response.data.message || 'Failed to initialize payment link',
        );
      }
    } catch (error) {
      this.logger.error('Paystack payment link initialization failed:', error);
      throw error;
    }
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  isConfigured(): boolean {
    return !!(this.secretKey && this.publicKey);
  }
}
