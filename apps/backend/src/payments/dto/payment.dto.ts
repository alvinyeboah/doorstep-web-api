import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty({
    description: 'Amount to pay in kobo (GHC 50 = 5000 kobo)',
    example: 5000,
    minimum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  amount: number;

  @ApiProperty({
    description: 'Customer email address',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Transaction reference (auto-generated if not provided)',
    example: 'ORD_123456789',
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Payment metadata (order ID, customer ID, etc.)',
    example: { orderId: 'order123', customerId: 'customer456' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Transaction reference from Paystack',
    example: 'ORD_123456789',
  })
  @IsString()
  @IsNotEmpty()
  reference: string;
}

export class InitializeStepperDepositDto {
  @ApiProperty({
    description: 'Stepper email address',
    example: 'stepper@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
