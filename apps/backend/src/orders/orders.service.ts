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
import { StepperService } from '../stepper/stepper.service';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => OrdersGateway))
    private ordersGateway: OrdersGateway,
    private pushNotificationService: PushNotificationService,
    @Inject(forwardRef(() => StepperService))
    private stepperService: StepperService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    // Use transaction for atomic stock management
    const order = await this.prisma.$transaction(async (tx) => {
      // Calculate total and validate stock availability
      let total = 0;
      const orderItems = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        // Check product exists, is available, and not soft-deleted
        if (!product || product.deletedAt !== null) {
          throw new NotFoundException(
            `Product ${item.productId} not found`,
          );
        }

        if (!product.available) {
          throw new BadRequestException(
            `Product "${product.name}" is currently unavailable`,
          );
        }

        // Check stock availability if stockQuantity is tracked
        if (product.stockQuantity !== null && product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
          );
        }

        total += product.price * item.quantity;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create the order
      const createdOrder = await tx.order.create({
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

      // Atomically update stock quantities and sold counts
      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        // Only decrement stock if it's being tracked (not null)
        if (product.stockQuantity !== null) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { decrement: item.quantity },
              soldCount: { increment: item.quantity },
            },
          });
        } else {
          // Just increment sold count if stock isn't tracked
          await tx.product.update({
            where: { id: item.productId },
            data: {
              soldCount: { increment: item.quantity },
            },
          });
        }
      }

      // Auto-clear cart after successful order creation
      const cart = await tx.cart.findUnique({
        where: { customerId: customer.id },
        include: { items: true },
      });

      if (cart && cart.items.length > 0) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return createdOrder;
    });

    // Auto-assign to nearest stepper if requested
    let suggestedStepper = null;
    if (dto.autoAssign) {
      try {
        suggestedStepper = await this.autoAssignNearestStepper(order.id);
      } catch (error) {
        console.error('Auto-assignment failed:', error);
        // Don't fail order creation if auto-assignment fails
      }
    }

    return {
      order,
      suggestedStepper,
      message: dto.autoAssign && suggestedStepper
        ? 'Order placed successfully. Nearest stepper has been notified.'
        : 'Order placed successfully and cart cleared',
    };
  }

  /**
   * Auto-assign order to nearest available stepper
   * Stepper receives notification and can accept/decline
   */
  async autoAssignNearestStepper(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        vendor: {
          select: {
            id: true,
            shopName: true,
            location: true,
          },
        },
      },
    });

    if (!order || !order.vendor.location) {
      throw new BadRequestException('Vendor location not available');
    }

    // Get vendor location
    const vendorLocation = order.vendor.location as any;
    const latitude = vendorLocation.coordinates[1];
    const longitude = vendorLocation.coordinates[0];

    // Find nearest available steppers (within 10km)
    const result = await this.stepperService.getNearbySteppers(
      latitude,
      longitude,
      10,
    );

    if (result.steppers.length === 0) {
      throw new NotFoundException('No available steppers nearby');
    }

    // Get the nearest stepper
    const nearestStepper = result.steppers[0];

    // Notify the stepper via WebSocket
    try {
      this.ordersGateway.notifyStepperNewOrder(nearestStepper.id, {
        orderId: order.id,
        vendorName: order.vendor.shopName,
        distance: nearestStepper.distance,
        deliveryFee: order.deliveryFee || 5.0,
      });
    } catch (error) {
      console.error('Failed to notify stepper via WebSocket:', error);
    }

    // Send push notification to stepper
    try {
      const stepper = await this.prisma.stepper.findUnique({
        where: { id: nearestStepper.id },
        include: { user: true },
      });

      if (stepper) {
        await this.pushNotificationService.sendPushToUser(stepper.userId, {
          title: 'New Delivery Opportunity!',
          body: `${order.vendor.shopName} - ${nearestStepper.distance}km away. GHC ${order.deliveryFee || 5.0} delivery fee.`,
          data: {
            orderId: order.id,
            type: 'new_delivery',
            distance: nearestStepper.distance,
          },
        });
      }
    } catch (error) {
      console.error('Failed to send push notification to stepper:', error);
    }

    return {
      stepperId: nearestStepper.id,
      stepperName: nearestStepper.name,
      distance: nearestStepper.distance,
      status: 'pending_acceptance',
    };
  }

  async getOrder(orderId: string, userId: string, userRole: string) {
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
            userId: true,
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

    // Authorization: Verify user has permission to view this order
    let hasAccess = false;

    if (userRole === 'SUPER_ADMIN') {
      hasAccess = true;
    } else if (userRole === 'CUSTOMER') {
      const customer = await this.prisma.customer.findUnique({
        where: { userId },
      });
      hasAccess = customer && order.customerId === customer.id;
    } else if (userRole === 'VENDOR') {
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId },
      });
      hasAccess = vendor && order.vendorId === vendor.id;
    } else if (userRole === 'STEPPER') {
      const stepper = await this.prisma.stepper.findUnique({
        where: { userId },
      });
      hasAccess = stepper && order.stepperId === stepper.id;
    }

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have permission to view this order',
      );
    }

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    userId: string,
    userRole: string,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        vendor: true,
        stepper: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Authorization: Verify user has permission to update this order
    if (userRole === 'VENDOR') {
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId },
      });

      if (!vendor) {
        throw new ForbiddenException('Vendor profile not found');
      }

      if (order.vendorId !== vendor.id) {
        throw new ForbiddenException(
          'You can only update orders for your own restaurant',
        );
      }

      // Vendors can only update to certain statuses
      const allowedVendorStatuses = [
        'ACCEPTED',
        'PREPARING',
        'READY',
        'CANCELLED',
      ];
      if (!allowedVendorStatuses.includes(dto.status)) {
        throw new BadRequestException(
          `Vendors can only update order status to: ${allowedVendorStatuses.join(', ')}`,
        );
      }
    } else if (userRole === 'STEPPER') {
      const stepper = await this.prisma.stepper.findUnique({
        where: { userId },
      });

      if (!stepper) {
        throw new ForbiddenException('Stepper profile not found');
      }

      if (order.stepperId !== stepper.id) {
        throw new ForbiddenException(
          'You can only update orders assigned to you',
        );
      }

      // Steppers can only update to certain statuses
      const allowedStepperStatuses = [
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'COMPLETED',
      ];
      if (!allowedStepperStatuses.includes(dto.status)) {
        throw new BadRequestException(
          `Steppers can only update order status to: ${allowedStepperStatuses.join(', ')}`,
        );
      }
    } else {
      throw new ForbiddenException(
        'Only vendors and steppers can update order status',
      );
    }

    // State machine validation: Prevent invalid status transitions
    const validTransitions: Record<string, string[]> = {
      PLACED: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
      OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
      DELIVERED: ['COMPLETED'],
      CANCELLED: [], // Terminal state
      COMPLETED: [], // Terminal state
    };

    const currentStatus = order.status;
    const newStatus = dto.status;

    if (!validTransitions[currentStatus]) {
      throw new BadRequestException(`Invalid current order status: ${currentStatus}`);
    }

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Valid transitions: ${validTransitions[currentStatus].join(', ') || 'none (terminal state)'}`,
      );
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
        // Use transaction for atomic commission crediting
        await this.prisma.$transaction(async (tx) => {
          // Create commission record
          await tx.commissionHistory.create({
            data: {
              stepperId: updated.stepperId,
              orderId: updated.id,
              amount: commission,
            },
          });

          // Update stepper wallet atomically
          await tx.wallet.update({
            where: { stepperId: updated.stepperId },
            data: {
              balance: { increment: commission },
              totalEarned: { increment: commission },
            },
          });
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

  /**
   * Stepper accepts an order (responds to auto-assignment)
   */
  async acceptOrder(orderId: string, userId: string) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: { include: { user: true } },
        vendor: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.stepperId) {
      throw new BadRequestException('Order already assigned to another stepper');
    }

    // Assign stepper and update status
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        stepperId: stepper.id,
        status: 'ACCEPTED',
      },
      include: {
        customer: { include: { user: true } },
        vendor: true,
        stepper: { include: { user: true } },
      },
    });

    // Notify customer via WebSocket
    try {
      this.ordersGateway.emitStepperAssigned(orderId, {
        id: stepper.id,
        name: stepper.user.name,
        phone: stepper.user.phone,
        rating: stepper.rating,
      });
    } catch (error) {
      console.error('Failed to emit stepper assignment:', error);
    }

    // Send push notification to customer
    try {
      await this.pushNotificationService.sendPushToUser(
        updated.customer.userId,
        {
          title: 'Stepper Assigned!',
          body: `${stepper.user.name} will deliver your order from ${order.vendor.shopName}`,
          data: {
            orderId: order.id,
            type: 'stepper_assigned',
            stepperId: stepper.id,
          },
        },
      );
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }

    return {
      order: updated,
      message: 'Order accepted successfully',
    };
  }

  /**
   * Stepper declines an order (responds to auto-assignment)
   * Order goes back to available pool or tries next nearest stepper
   */
  async declineOrder(orderId: string, userId: string) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Just log the decline - order remains available for other steppers
    return {
      message: 'Order declined. It will be offered to the next nearest stepper.',
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
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['PLACED', 'ACCEPTED'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    // Use transaction to atomically cancel order and restore stock
    const updated = await this.prisma.$transaction(async (tx) => {
      // Cancel the order
      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      // Restore stock for each product in the order
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        // Only restore stock if product still exists and tracks stock
        if (product && product.stockQuantity !== null) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { increment: item.quantity },
              soldCount: { decrement: item.quantity },
            },
          });
        }
      }

      return cancelledOrder;
    });

    return {
      order: updated,
      message: 'Order cancelled successfully and stock restored',
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
