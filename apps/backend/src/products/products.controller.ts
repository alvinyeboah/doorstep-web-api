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

  // NOTE: Vendor product management (CREATE, UPDATE, DELETE, MY-PRODUCTS) moved to /vendor/products
  // This controller now only handles PUBLIC product browsing endpoints

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
