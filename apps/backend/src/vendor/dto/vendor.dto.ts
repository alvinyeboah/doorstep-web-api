import { IsString, IsOptional, IsNotEmpty, IsObject } from 'class-validator';

export class RegisterVendorDto {
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @IsString()
  @IsOptional()
  businessType?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsObject()
  @IsOptional()
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  @IsObject()
  @IsOptional()
  hours?: {
    open: string;
    close: string;
  };
}

export class UpdateVendorDto {
  @IsString()
  @IsOptional()
  shopName?: string;

  @IsString()
  @IsOptional()
  businessType?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsObject()
  @IsOptional()
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @IsObject()
  @IsOptional()
  hours?: {
    open: string;
    close: string;
  };
}
