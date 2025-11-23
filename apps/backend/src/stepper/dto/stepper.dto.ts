import { IsString, IsOptional, IsNotEmpty, IsObject, IsNumber, Min } from 'class-validator';

export class RegisterStepperDto {
  @IsString()
  @IsOptional()
  studentIdUrl?: string;

  @IsString()
  @IsOptional()
  governmentIdUrl?: string;

  @IsObject()
  @IsOptional()
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };

  @IsObject()
  @IsOptional()
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  @IsString()
  @IsOptional()
  pictureUrl?: string;
}

export class UpdateStepperDto {
  @IsString()
  @IsOptional()
  studentIdUrl?: string;

  @IsString()
  @IsOptional()
  governmentIdUrl?: string;

  @IsObject()
  @IsOptional()
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };

  @IsObject()
  @IsOptional()
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  @IsString()
  @IsOptional()
  pictureUrl?: string;

  @IsObject()
  @IsOptional()
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export class DepositDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;
}

export class WithdrawalRequestDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;
}

export class UpdateAvailabilityDto {
  @IsNotEmpty()
  available: boolean;
}
