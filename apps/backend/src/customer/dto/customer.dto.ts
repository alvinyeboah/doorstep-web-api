import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCustomerDto {
  @ApiPropertyOptional({
    description: 'Residential hall or dormitory name',
    example: 'Legon Hall',
  })
  @IsString()
  @IsOptional()
  hall?: string;

  @ApiPropertyOptional({
    description: 'Delivery address or room number',
    example: 'Room 204, Legon Hall',
  })
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Residential hall or dormitory name',
    example: 'Legon Hall',
  })
  @IsString()
  @IsOptional()
  hall?: string;

  @ApiPropertyOptional({
    description: 'Delivery address or room number',
    example: 'Room 204, Legon Hall',
  })
  @IsString()
  @IsOptional()
  address?: string;
}

export class AddToCartDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: 'clp123abc456def',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item (0 to remove)',
    example: 3,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}

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
}
