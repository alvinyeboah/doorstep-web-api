import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  RegisterCustomerDto,
  UpdateCustomerDto,
  AddToCartDto,
  UpdateCartItemDto,
} from './dto/customer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post('register')
  async register(@CurrentUser() user: any, @Body() dto: RegisterCustomerDto) {
    return this.customerService.register(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.updateProfile(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.customerService.getProfile(user.id);
  }

  // Cart endpoints
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('cart')
  async getCart(@CurrentUser() user: any) {
    return this.customerService.getCart(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post('cart/add')
  async addToCart(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.customerService.addToCart(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Put('cart/item/:itemId')
  async updateCartItem(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.customerService.updateCartItem(user.id, itemId, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Delete('cart/clear')
  async clearCart(@CurrentUser() user: any) {
    return this.customerService.clearCart(user.id);
  }

  // Order endpoints
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('orders')
  async getOrders(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.customerService.getOrders(user.id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('orders/:id')
  async getOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.customerService.getOrder(user.id, id);
  }
}
