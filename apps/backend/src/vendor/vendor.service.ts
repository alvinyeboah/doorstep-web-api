import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterVendorDto, UpdateVendorDto } from './dto/vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: RegisterVendorDto) {
    // Check if user is a vendor
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'VENDOR') {
      throw new ForbiddenException('Only vendors can register as vendors');
    }

    // Check if vendor already exists
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      throw new ForbiddenException('Vendor profile already exists');
    }

    const vendor = await this.prisma.vendor.create({
      data: {
        userId,
        shopName: dto.shopName,
        businessType: dto.businessType,
        description: dto.description,
        address: dto.address,
        location: dto.location as any,
        hours: dto.hours as any,
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

    return {
      vendor,
      message: 'Vendor registered successfully',
    };
  }

  async updateProfile(userId: string, dto: UpdateVendorDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const updated = await this.prisma.vendor.update({
      where: { userId },
      data: dto,
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

    return {
      vendor: updated,
      message: 'Vendor profile updated successfully',
    };
  }

  async getProfile(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        products: true,
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async getMyProfile(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
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
        products: true,
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return vendor;
  }

  async getAllVendors(search?: string) {
    const where = search
      ? {
          OR: [
            { shopName: { contains: search, mode: 'insensitive' as any } },
            { businessType: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const vendors = await this.prisma.vendor.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return vendors;
  }

  async getOrders(userId: string, status?: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const where: any = { vendorId: vendor.id };
    if (status) {
      where.status = status;
    }

    const orders = await this.prisma.order.findMany({
      where,
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

  async getAnalytics(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const totalOrders = await this.prisma.order.count({
      where: { vendorId: vendor.id },
    });

    const completedOrders = await this.prisma.order.count({
      where: { vendorId: vendor.id, status: 'COMPLETED' },
    });

    const totalRevenue = await this.prisma.order.aggregate({
      where: { vendorId: vendor.id, status: 'COMPLETED' },
      _sum: { total: true },
    });

    const totalProducts = await this.prisma.product.count({
      where: { vendorId: vendor.id },
    });

    const averageRating = await this.prisma.rating.aggregate({
      where: { vendorId: vendor.id },
      _avg: { vendorRating: true },
    });

    return {
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      averageRating: averageRating._avg.vendorRating || 0,
    };
  }
}
