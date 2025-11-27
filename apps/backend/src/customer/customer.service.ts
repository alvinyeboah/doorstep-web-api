import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterCustomerDto,
  UpdateCustomerDto,
  AddToCartDto,
  UpdateCartItemDto,
  CreateOrderDto,
} from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: RegisterCustomerDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'CUSTOMER') {
      throw new ForbiddenException('Only customers can register as customers');
    }

    const existingCustomer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (existingCustomer) {
      throw new ForbiddenException('Customer profile already exists');
    }

    const customer = await this.prisma.customer.create({
      data: {
        userId,
        hall: dto.hall,
        address: dto.address,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Create cart for customer
    await this.prisma.cart.create({
      data: { customerId: customer.id },
    });

    return {
      customer,
      message: 'Customer registered successfully',
    };
  }

  async updateProfile(userId: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const updated = await this.prisma.customer.update({
      where: { userId },
      data: dto,
    });

    return {
      customer: updated,
      message: 'Profile updated successfully',
    };
  }

  async getProfile(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    return customer;
  }

  // Cart Operations
  async getCart(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { customerId: customer.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                vendor: {
                  select: {
                    id: true,
                    shopName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const total =
      cart?.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ) || 0;

    return {
      ...cart,
      total,
    };
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: { cart: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || !product.available) {
      throw new NotFoundException('Product not available');
    }

    let cart = customer.cart;
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { customerId: customer.id },
      });
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    return { message: 'Item added to cart' };
  }

  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: { cart: true },
    });

    if (!customer || !customer.cart) {
      throw new NotFoundException('Cart not found');
    }

    if (dto.quantity === 0) {
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
      return { message: 'Item removed from cart' };
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return { message: 'Cart item updated' };
  }

  async clearCart(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: { cart: true },
    });

    if (!customer || !customer.cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: customer.cart.id },
    });

    return { message: 'Cart cleared' };
  }

  // Order Operations
  async getOrders(userId: string, status?: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const where: any = { customerId: customer.id };
    if (status) {
      where.status = status;
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  async getOrder(userId: string, orderId: string) {
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
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
