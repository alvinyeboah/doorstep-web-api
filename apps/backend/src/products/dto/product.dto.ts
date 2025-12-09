import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Jollof Rice with Chicken',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product price in local currency (GHC)',
    example: 25.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    description: 'Original price before discount (for showing "was $30, now $25")',
    example: 30.00,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({
    description: 'Discounted price if on sale',
    example: 22.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @ApiPropertyOptional({
    description: 'Detailed product description',
    example: 'Delicious jollof rice served with grilled chicken and coleslaw',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Primary product image URL',
    example: 'https://example.com/images/jollof-rice.jpg',
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Array of product image URLs (supports multiple images)',
    example: ['https://example.com/images/jollof-1.jpg', 'https://example.com/images/jollof-2.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Main Course',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product tags for filtering (vegetarian, spicy, halal, gluten-free, etc.)',
    example: ['spicy', 'halal', 'popular'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Allergen warnings (nuts, dairy, shellfish, gluten, etc.)',
    example: ['gluten', 'dairy'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiPropertyOptional({
    description: 'Calories (nutritional information)',
    example: 650,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  calories?: number;

  @ApiPropertyOptional({
    description: 'Estimated preparation/cooking time in minutes',
    example: 25,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  preparationTime?: number;

  @ApiPropertyOptional({
    description: 'Stock quantity available (for inventory tracking)',
    example: 50,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @ApiPropertyOptional({
    description: 'Mark as popular/featured item',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the product is currently available',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Jollof Rice with Chicken',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product price in local currency (GHC)',
    example: 25.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Original price before discount',
    example: 30.00,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({
    description: 'Discounted price if on sale',
    example: 22.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @ApiPropertyOptional({
    description: 'Detailed product description',
    example: 'Delicious jollof rice served with grilled chicken and coleslaw',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Primary product image URL',
    example: 'https://example.com/images/jollof-rice.jpg',
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Array of product image URLs',
    example: ['https://example.com/images/jollof-1.jpg', 'https://example.com/images/jollof-2.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Main Course',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product tags',
    example: ['spicy', 'halal'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Allergen warnings',
    example: ['gluten', 'dairy'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiPropertyOptional({
    description: 'Calories',
    example: 650,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  calories?: number;

  @ApiPropertyOptional({
    description: 'Preparation time in minutes',
    example: 25,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  preparationTime?: number;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @ApiPropertyOptional({
    description: 'Mark as popular/featured',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @ApiPropertyOptional({
    description: 'Product availability',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
