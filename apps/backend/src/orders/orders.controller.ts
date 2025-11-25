import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, RateOrderDto } from './dto/order.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post()
  async createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR', 'STEPPER')
  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('available/list')
  async getAvailableOrders() {
    return this.ordersService.getAvailableOrders();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post(':id/accept')
  async acceptOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.acceptOrder(user.id, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post(':id/rate')
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
  async cancelOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.cancelOrder(user.id, id);
  }
}
