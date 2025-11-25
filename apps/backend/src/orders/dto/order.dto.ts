import { IsString, IsArray, IsOptional, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

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

export class UpdateOrderStatusDto {
  @IsEnum(['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'])
  @IsNotEmpty()
  status: string;
}

export class AssignStepperDto {
  @IsString()
  @IsNotEmpty()
  stepperId: string;
}

export class RateOrderDto {
  @IsNumber()
  @IsOptional()
  vendorRating?: number;

  @IsNumber()
  @IsOptional()
  stepperRating?: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}
