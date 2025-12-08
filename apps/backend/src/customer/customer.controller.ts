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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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

@ApiTags('customers')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register as a customer',
    description: 'User with customer role registers their profile',
  })
  @ApiResponse({
    status: 201,
    description: 'Customer profile created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data or already registered',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - customer role required',
  })
  async register(@CurrentUser() user: any, @Body() dto: RegisterCustomerDto) {
    return this.customerService.register(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update customer profile',
    description: 'Customer updates their profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer profile updated successfully',
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
    description: 'Forbidden - customer role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer profile not found',
  })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.updateProfile(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my customer profile',
    description: 'Customer retrieves their own profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - customer role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer profile not found',
  })
  async getProfile(@CurrentUser() user: any) {
    return this.customerService.getProfile(user.id);
  }

  // Cart endpoints
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('cart')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get shopping cart',
    description: 'Customer retrieves their current shopping cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - customer role required',
  })
  async getCart(@CurrentUser() user: any) {
    return this.customerService.getCart(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post('cart/add')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Customer adds a product to their shopping cart',
  })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
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
    description: 'Forbidden - customer role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async addToCart(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.customerService.addToCart(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Put('cart/item/:itemId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update cart item quantity',
    description: 'Customer updates the quantity of an item in their cart',
  })
  @ApiParam({
    name: 'itemId',
    description: 'Cart item ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
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
    description: 'Forbidden - customer role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Clear shopping cart',
    description: 'Customer clears all items from their shopping cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - customer role required',
  })
  async clearCart(@CurrentUser() user: any) {
    return this.customerService.clearCart(user.id);
  }

  // Order endpoints
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('orders')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get customer orders',
    description: 'Customer retrieves their order history with optional status filter',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter by order status',
    example: 'DELIVERED',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - customer role required',
  })
  async getOrders(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.customerService.getOrders(user.id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('orders/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get customer order by ID',
    description: 'Customer retrieves details of a specific order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - customer role required or not your order',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async getOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.customerService.getOrder(user.id, id);
  }
}
