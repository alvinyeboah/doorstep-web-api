import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  RateOrderDto,
} from './dto/order.dto';
import { CalculateDeliveryFeeDto } from './dto/calculate-fee.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Customer creates a new order from their cart or directly',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
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
  async createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve detailed information about a specific order',
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
    status: 404,
    description: 'Order not found',
  })
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR', 'STEPPER')
  @Put(':id/status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update order status',
    description: 'Vendor or stepper updates the order status',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid status',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - vendor or stepper role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('available/list')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get available orders',
    description: 'Stepper retrieves list of orders available for delivery',
  })
  @ApiResponse({
    status: 200,
    description: 'Available orders retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async getAvailableOrders() {
    return this.ordersService.getAvailableOrders();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post(':id/accept')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Accept an order for delivery',
    description: 'Stepper accepts an available order for delivery',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Order accepted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - order already assigned or unavailable',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async acceptOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.acceptOrder(user.id, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post(':id/rate')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rate an order',
    description: 'Customer rates the vendor and/or stepper after order completion',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Order rated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - order not completed or already rated',
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
  async rateOrder(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: RateOrderDto,
  ) {
    return this.ordersService.rateOrder(user.id, id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post(':id/cancel')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel an order',
    description: 'Customer cancels their own order (if not yet accepted)',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'clp123abc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - order cannot be cancelled at this stage',
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
  async cancelOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.cancelOrder(user.id, id);
  }

  @Post('calculate-fee')
  @ApiOperation({
    summary: 'Calculate delivery fee',
    description:
      'Calculate delivery fee based on distance between vendor and customer location',
  })
  @ApiResponse({
    status: 200,
    description: 'Delivery fee calculated successfully',
    schema: {
      type: 'object',
      properties: {
        distance: { type: 'string', example: '2.5 km' },
        deliveryFee: { type: 'number', example: 7 },
        currency: { type: 'string', example: 'GHC' },
        breakdown: {
          type: 'object',
          properties: {
            baseFee: { type: 'number', example: 7 },
            additionalFee: { type: 'number', example: 0 },
            totalFee: { type: 'number', example: 7 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid coordinates',
  })
  async calculateDeliveryFee(@Body() dto: CalculateDeliveryFeeDto) {
    return this.ordersService.calculateFee(dto);
  }
}
