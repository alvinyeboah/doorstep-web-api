import { IsString, IsOptional, IsNotEmpty, IsNumber, IsArray, Min } from 'class-validator';

export class RegisterCustomerDto {
  @IsString()
  @IsOptional()
  hall?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  hall?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsArray()
  @IsNotEmpty()
  items: {
    productId: string;
    quantity: number;
  }[];

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsString()
  @IsOptional()
  customerNotes?: string;
}
