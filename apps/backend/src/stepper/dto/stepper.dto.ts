import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterStepperDto {
  @ApiPropertyOptional({
    description: 'URL of uploaded student ID',
    example: 'https://example.com/uploads/student-id-123.jpg',
  })
  @IsString()
  @IsOptional()
  studentIdUrl?: string;

  @ApiPropertyOptional({
    description: 'URL of uploaded government-issued ID',
    example: 'https://example.com/uploads/govt-id-456.jpg',
  })
  @IsString()
  @IsOptional()
  governmentIdUrl?: string;

  @ApiPropertyOptional({
    description: 'Bank account details for payment processing',
    example: {
      accountNumber: '1234567890',
      bankName: 'GCB Bank',
      accountHolderName: 'John Doe',
    },
  })
  @IsObject()
  @IsOptional()
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };

  @ApiPropertyOptional({
    description: 'Emergency contact information',
    example: {
      name: 'Jane Doe',
      phone: '+233244123456',
      relationship: 'Sister',
    },
  })
  @IsObject()
  @IsOptional()
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  @ApiPropertyOptional({
    description: 'URL of profile picture',
    example: 'https://example.com/uploads/profile-789.jpg',
  })
  @IsString()
  @IsOptional()
  pictureUrl?: string;
}

export class UpdateStepperDto {
  @ApiPropertyOptional({
    description: 'URL of uploaded student ID',
    example: 'https://example.com/uploads/student-id-123.jpg',
  })
  @IsString()
  @IsOptional()
  studentIdUrl?: string;

  @ApiPropertyOptional({
    description: 'URL of uploaded government-issued ID',
    example: 'https://example.com/uploads/govt-id-456.jpg',
  })
  @IsString()
  @IsOptional()
  governmentIdUrl?: string;

  @ApiPropertyOptional({
    description: 'Bank account details for payment processing',
    example: {
      accountNumber: '1234567890',
      bankName: 'GCB Bank',
      accountHolderName: 'John Doe',
    },
  })
  @IsObject()
  @IsOptional()
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };

  @ApiPropertyOptional({
    description: 'Emergency contact information',
    example: {
      name: 'Jane Doe',
      phone: '+233244123456',
      relationship: 'Sister',
    },
  })
  @IsObject()
  @IsOptional()
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  @ApiPropertyOptional({
    description: 'URL of profile picture',
    example: 'https://example.com/uploads/profile-789.jpg',
  })
  @IsString()
  @IsOptional()
  pictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Current location as GeoJSON Point with coordinates [longitude, latitude]',
    example: {
      type: 'Point',
      coordinates: [-0.1870, 5.6510],
    },
  })
  @IsObject()
  @IsOptional()
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export class DepositDto {
  @ApiProperty({
    description: 'Deposit amount',
    example: 100.0,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;
}

export class WithdrawalRequestDto {
  @ApiProperty({
    description: 'Withdrawal amount',
    example: 50.0,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;
}

export class UpdateAvailabilityDto {
  @ApiProperty({
    description: 'Availability status for accepting deliveries',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  available: boolean;
}
