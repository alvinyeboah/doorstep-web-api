import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Vendor creates a new product for their shop',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - vendor role required',
  })
  async create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product',
    description: 'Vendor updates their own product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update own products',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(user.id, id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Vendor deletes their own product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only delete own products',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.delete(user.id, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('my-products')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my products',
    description: 'Vendor retrieves all their own products',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - vendor role required',
  })
  async getMyProducts(@CurrentUser() user: any) {
    return this.productsService.getMyProducts(user.id);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({
    summary: 'Get products by vendor',
    description: 'Retrieve all products from a specific vendor',
  })
  @ApiParam({
    name: 'vendorId',
    description: 'Vendor ID',
    example: 'clp456xyz789abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor not found',
  })
  async getProductsByVendor(@Param('vendorId') vendorId: string) {
    return this.productsService.getProductsByVendor(vendorId);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search products',
    description: 'Search for products by name, description, or category',
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query',
    example: 'jollof rice',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async searchProducts(@Query('q') search: string) {
    return this.productsService.searchProducts(search);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve all available products with pagination (for homepage)',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    example: 20,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully with pagination info',
  })
  async getAllProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.productsService.getAllProducts(pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve detailed information about a specific product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }
}
