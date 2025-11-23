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
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Put(':id')
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
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.delete(user.id, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('my-products')
  async getMyProducts(@CurrentUser() user: any) {
    return this.productsService.getMyProducts(user.id);
  }

  @Get('vendor/:vendorId')
  async getProductsByVendor(@Param('vendorId') vendorId: string) {
    return this.productsService.getProductsByVendor(vendorId);
  }

  @Get('search')
  async searchProducts(@Query('q') search: string) {
    return this.productsService.searchProducts(search);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }
}
