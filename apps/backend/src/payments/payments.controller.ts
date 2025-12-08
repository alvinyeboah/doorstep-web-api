import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import {
  InitializePaymentDto,
  VerifyPaymentDto,
  InitializeStepperDepositDto,
} from './dto/payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post('initialize')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Initialize a payment',
    description:
      'Initialize a Paystack payment transaction and get authorization URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment initialized successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Payment initialized successfully' },
        data: {
          type: 'object',
          properties: {
            authorization_url: {
              type: 'string',
              example: 'https://checkout.paystack.com/abc123',
            },
            access_code: { type: 'string', example: 'abc123xyz' },
            reference: { type: 'string', example: 'PAY_1234567890' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data or payment service not configured',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async initializePayment(@Body() dto: InitializePaymentDto) {
    return this.paymentsService.initializePayment(dto);
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify a payment',
    description: 'Verify a Paystack payment transaction using reference',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Payment verified successfully' },
        data: {
          type: 'object',
          properties: {
            reference: { type: 'string', example: 'PAY_1234567890' },
            amount: { type: 'number', example: 50 },
            currency: { type: 'string', example: 'GHS' },
            status: { type: 'string', example: 'success' },
            paid_at: {
              type: 'string',
              example: '2025-12-08T14:30:00.000Z',
            },
            customer: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'customer@example.com' },
              },
            },
            metadata: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid reference or verification failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('stepper-deposit')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Initialize stepper security deposit payment',
    description:
      'Initialize GHC 1000 security deposit payment for stepper verification',
  })
  @ApiResponse({
    status: 200,
    description: 'Deposit payment initialized successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Security deposit payment initialized. Amount: GHC 1000',
        },
        data: {
          type: 'object',
          properties: {
            authorization_url: {
              type: 'string',
              example: 'https://checkout.paystack.com/abc123',
            },
            access_code: { type: 'string', example: 'abc123xyz' },
            reference: { type: 'string', example: 'DEPOSIT_stepper123_1234567890' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - stepper not found or deposit already paid',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async initializeStepperDeposit(
    @CurrentUser() user: any,
    @Body() dto: InitializeStepperDepositDto,
  ) {
    return this.paymentsService.initializeStepperDeposit(user.id, dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Paystack webhook endpoint',
    description:
      'Receive and process payment webhooks from Paystack (charge.success, etc.)',
  })
  @ApiHeader({
    name: 'x-paystack-signature',
    description: 'Paystack webhook signature for verification',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid signature or payload',
  })
  async handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Body() payload: any,
  ) {
    return this.paymentsService.handleWebhook(signature, payload);
  }
}
