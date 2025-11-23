import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  // Platform Analytics
  async getPlatformAnalytics() {
    const [
      totalVendors,
      totalSteppers,
      totalCustomers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      activeOrders,
      completedOrders,
    ] = await Promise.all([
      this.prisma.vendor.count(),
      this.prisma.stepper.count(),
      this.prisma.customer.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { total: true },
      }),
      this.prisma.order.count({ where: { status: 'PLACED' } }),
      this.prisma.order.count({
        where: {
          status: {
            in: ['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'],
          },
        },
      }),
      this.prisma.order.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      totalVendors,
      totalSteppers,
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      activeOrders,
      completedOrders,
    };
  }

  // Get all vendors (companies like KFC, McDonald's, etc.)
  async getAllVendors(verified?: boolean) {
    const where = verified !== undefined ? { verified } : {};

    return this.prisma.vendor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get specific vendor (company) details
  async getVendorDetails(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: true,
        products: true,
        orders: {
          include: {
            items: true,
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
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        },
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

    const revenue = await this.prisma.order.aggregate({
      where: {
        vendorId,
        status: 'COMPLETED',
      },
      _sum: { total: true },
    });

    return {
      ...vendor,
      revenue: revenue._sum.total || 0,
    };
  }

  // Approve/Reject vendor registration
  async updateVendorStatus(vendorId: string, verified: boolean) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: { verified },
    });
  }

  // Get all orders across all vendors
  async getAllOrders(status?: string, limit = 100) {
    const where = status ? { status: status as any } : {};

    return this.prisma.order.findMany({
      where,
      include: {
        customer: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        vendor: {
          select: {
            id: true,
            shopName: true,
            user: {
              select: {
                name: true,
                email: true,
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
      take: limit,
    });
  }

  // Revenue analytics by vendor
  async getRevenueByVendor() {
    const vendors = await this.prisma.vendor.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const revenueData = await Promise.all(
      vendors.map(async (vendor) => {
        const revenue = await this.prisma.order.aggregate({
          where: {
            vendorId: vendor.id,
            status: 'COMPLETED',
          },
          _sum: { total: true },
          _count: true,
        });

        return {
          vendorId: vendor.id,
          vendorName: vendor.shopName,
          ownerName: vendor.user.name,
          totalRevenue: revenue._sum.total || 0,
          totalOrders: revenue._count,
        };
      }),
    );

    return revenueData.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  // Get all users
  async getAllUsers(role?: string) {
    const where = role ? { role } : {};

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
