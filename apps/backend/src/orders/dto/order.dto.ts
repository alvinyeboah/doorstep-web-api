import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'clp123abc456def',
  })
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Vendor ID to order from',
    example: 'clp456xyz789abc',
  })
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty({
    description: 'Array of order items with product IDs and quantities',
    type: [OrderItemDto],
    example: [
      { productId: 'clp123abc456def', quantity: 2 },
      { productId: 'clp789ghi012jkl', quantity: 1 },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  items: {
    productId: string;
    quantity: number;
  }[];

  @ApiPropertyOptional({
    description: 'Delivery address for the order',
    example: 'Room 204, Legon Hall, University of Ghana',
  })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiPropertyOptional({
    description: 'Additional notes or special requests for the order',
    example: 'Please add extra pepper sauce',
  })
  @IsString()
  @IsOptional()
  customerNotes?: string;

  @ApiPropertyOptional({
    description: 'Auto-assign to nearest available stepper',
    example: true,
    default: false,
  })
  @IsOptional()
  autoAssign?: boolean;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: [
      'PLACED',
      'ACCEPTED',
      'PREPARING',
      'READY',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'COMPLETED',
      'CANCELLED',
    ],
    example: 'PREPARING',
  })
  @IsEnum([
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
  ])
  @IsNotEmpty()
  status: string;
}

export class AssignStepperDto {
  @ApiProperty({
    description: 'Stepper (delivery person) ID to assign to the order',
    example: 'clp890def456ghi',
  })
  @IsString()
  @IsNotEmpty()
  stepperId: string;
}

export class RateOrderDto {
  @ApiPropertyOptional({
    description: 'Rating for the vendor (1-5 stars)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsOptional()
  vendorRating?: number;

  @ApiPropertyOptional({
    description: 'Rating for the stepper/delivery person (1-5 stars)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsOptional()
  stepperRating?: number;

  @ApiPropertyOptional({
    description: 'Feedback or review text',
    example: 'Great food and fast delivery!',
  })
  @IsString()
  @IsOptional()
  feedback?: string;
}
