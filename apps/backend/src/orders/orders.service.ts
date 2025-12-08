import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  RateOrderDto,
} from './dto/order.dto';
import { CalculateDeliveryFeeDto } from './dto/calculate-fee.dto';
import {
  calculateDistance,
  calculateDeliveryFee,
} from '../common/utils/geolocation.utils';
import { OrdersGateway } from './orders.gateway';
import { PushNotificationService } from '../notifications/push-notification.service';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => OrdersGateway))
    private ordersGateway: OrdersGateway,
    private pushNotificationService: PushNotificationService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.available) {
        throw new BadRequestException(
          `Product ${item.productId} not available`,
        );
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await this.prisma.order.create({
      data: {
        customerId: customer.id,
        vendorId: dto.vendorId,
        total,
        deliveryAddress: dto.deliveryAddress,
        customerNotes: dto.customerNotes,
        status: 'PLACED',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        vendor: {
          select: {
            shopName: true,
            address: true,
          },
        },
      },
    });

    // Auto-clear cart after successful order creation
    const cart = await this.prisma.cart.findUnique({
      where: { customerId: customer.id },
      include: { items: true },
    });

    if (cart && cart.items.length > 0) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return {
      order,
      message: 'Order placed successfully and cart cleared',
    };
  }

  async getOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
        vendor: {
          select: {
            id: true,
            shopName: true,
            address: true,
          },
        },
        stepper: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        rating: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status as any },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        vendor: true,
        stepper: {
          include: {
            user: true,
            wallet: true,
          },
        },
      },
    });

    // Auto-calculate and credit commission when order is DELIVERED
    if (dto.status === 'DELIVERED' && updated.stepperId) {
      const deliveryFee = updated.deliveryFee || 5.0; // Default GHC 5 if not set
      const commission = deliveryFee * 0.8; // 80% to stepper

      // Check if commission already exists for this order
      const existingCommission = await this.prisma.commissionHistory.findUnique(
        {
          where: { orderId: updated.id },
        },
      );

      if (!existingCommission) {
        // Create commission record
        await this.prisma.commissionHistory.create({
          data: {
            stepperId: updated.stepperId,
            orderId: updated.id,
            amount: commission,
          },
        });

        // Update stepper wallet
        await this.prisma.wallet.update({
          where: { stepperId: updated.stepperId },
          data: {
            balance: { increment: commission },
            totalEarned: { increment: commission },
          },
        });
      }
    }

    // Emit real-time update via WebSocket
    try {
      this.ordersGateway.emitOrderStatusUpdate(
        updated.id,
        dto.status,
        updated,
      );
    } catch (error) {
      console.error('Failed to emit WebSocket update:', error);
    }

    // Send push notification to customer
    try {
      const statusMessages: Record<string, string> = {
        PLACED: 'Your order has been placed!',
        ACCEPTED: 'Your order has been accepted by the vendor.',
        PREPARING: 'Your order is being prepared.',
        READY: 'Your order is ready for pickup!',
        OUT_FOR_DELIVERY: 'Your order is out for delivery!',
        DELIVERED: 'Your order has been delivered. Enjoy!',
        COMPLETED: 'Thank you for your order!',
        CANCELLED: 'Your order has been cancelled.',
      };

      await this.pushNotificationService.sendPushToUser(updated.customer.userId, {
        title: 'Order Update',
        body: statusMessages[dto.status] || `Order status: ${dto.status}`,
        data: {
          orderId: updated.id,
          status: dto.status,
          type: 'order_update',
        },
      });
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }

    return {
      order: updated,
      message:
        dto.status === 'DELIVERED' && updated.stepperId
          ? `Order status updated and GHC ${(updated.deliveryFee || 5.0) * 0.8} commission credited to stepper`
          : 'Order status updated',
    };
  }

  async assignStepper(orderId: string, stepperId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.stepperId) {
      throw new BadRequestException('Order already has a stepper assigned');
    }

    const stepper = await this.prisma.stepper.findUnique({
      where: { id: stepperId },
    });

    if (!stepper || !stepper.available) {
      throw new BadRequestException('Stepper not available');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { stepperId, status: 'ACCEPTED' },
    });

    return {
      order: updated,
      message: 'Stepper assigned to order',
    };
  }

  async getAvailableOrders() {
    const orders = await this.prisma.order.findMany({
      where: {
        stepperId: null,
        status: {
          in: ['PLACED', 'READY'],
        },
      },
      include: {
        vendor: {
          select: {
            shopName: true,
            address: true,
            location: true,
          },
        },
        customer: {
          select: {
            address: true,
            hall: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return orders;
  }

  async acceptOrder(userId: string, orderId: string) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    return this.assignStepper(orderId, stepper.id);
  }

  async rateOrder(userId: string, orderId: string, dto: RateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: customer.id,
        status: 'COMPLETED',
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found or not completed');
    }

    const existingRating = await this.prisma.rating.findUnique({
      where: { orderId },
    });

    if (existingRating) {
      throw new BadRequestException('Order already rated');
    }

    const rating = await this.prisma.rating.create({
      data: {
        orderId,
        vendorId: order.vendorId,
        stepperId: order.stepperId,
        vendorRating: dto.vendorRating,
        stepperRating: dto.stepperRating,
        feedback: dto.feedback,
      },
    });

    // Update stepper average rating if rated
    if (dto.stepperRating && order.stepperId) {
      const avgRating = await this.prisma.rating.aggregate({
        where: { stepperId: order.stepperId },
        _avg: { stepperRating: true },
      });

      await this.prisma.stepper.update({
        where: { id: order.stepperId },
        data: { rating: avgRating._avg.stepperRating },
      });
    }

    return {
      rating,
      message: 'Order rated successfully',
    };
  }

  async cancelOrder(userId: string, orderId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: customer.id,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['PLACED', 'ACCEPTED'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    return {
      order: updated,
      message: 'Order cancelled successfully',
    };
  }

  /**
   * Calculate delivery fee based on distance between vendor and customer
   */
  async calculateFee(dto: CalculateDeliveryFeeDto) {
    const vendorLocation = {
      latitude: dto.vendorLat,
      longitude: dto.vendorLng,
    };

    const customerLocation = {
      latitude: dto.customerLat,
      longitude: dto.customerLng,
    };

    const distance = calculateDistance(vendorLocation, customerLocation);
    const fee = calculateDeliveryFee(distance);

    return {
      distance: `${distance} km`,
      deliveryFee: fee,
      currency: 'GHC',
      breakdown: {
        baseFee: distance <= 1 ? 5 : distance <= 3 ? 7 : 10,
        additionalFee: distance > 5 ? (fee - 10) : 0,
        totalFee: fee,
      },
    };
  }
}
