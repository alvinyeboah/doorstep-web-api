import { IsString, IsOptional, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterVendorDto {
  @ApiProperty({
    description: 'Shop or business name',
    example: 'Campus Bites Restaurant',
  })
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @ApiPropertyOptional({
    description: 'Type of business',
    example: 'Restaurant',
  })
  @IsString()
  @IsOptional()
  businessType?: string;

  @ApiPropertyOptional({
    description: 'Description of the business and offerings',
    example: 'Authentic Ghanaian cuisine with fast delivery on campus',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Physical address of the business',
    example: 'Shop 5, Legon Mall, University of Ghana',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'GeoJSON Point location with coordinates [longitude, latitude]',
    example: {
      type: 'Point',
      coordinates: [-0.1870, 5.6510],
    },
  })
  @IsObject()
  @IsOptional()
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  @ApiPropertyOptional({
    description: 'Business operating hours',
    example: {
      open: '08:00',
      close: '22:00',
    },
  })
  @IsObject()
  @IsOptional()
  hours?: {
    open: string;
    close: string;
  };
}

export class UpdateVendorDto {
  @ApiPropertyOptional({
    description: 'Shop or business name',
    example: 'Campus Bites Restaurant',
  })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiPropertyOptional({
    description: 'Type of business',
    example: 'Restaurant',
  })
  @IsString()
  @IsOptional()
  businessType?: string;

  @ApiPropertyOptional({
    description: 'Description of the business and offerings',
    example: 'Authentic Ghanaian cuisine with fast delivery on campus',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Physical address of the business',
    example: 'Shop 5, Legon Mall, University of Ghana',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'GeoJSON Point location with coordinates [longitude, latitude]',
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

  @ApiPropertyOptional({
    description: 'Business operating hours',
    example: {
      open: '08:00',
      close: '22:00',
    },
  })
  @IsObject()
  @IsOptional()
  hours?: {
    open: string;
    close: string;
  };
}
