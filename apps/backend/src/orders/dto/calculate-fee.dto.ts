import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CalculateDeliveryFeeDto {
  @ApiProperty({
    description: 'Vendor latitude',
    example: 5.7597,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  vendorLat: number;

  @ApiProperty({
    description: 'Vendor longitude',
    example: -0.2270,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  vendorLng: number;

  @ApiProperty({
    description: 'Customer latitude',
    example: 5.7600,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  customerLat: number;

  @ApiProperty({
    description: 'Customer longitude',
    example: -0.2280,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  customerLng: number;
}
