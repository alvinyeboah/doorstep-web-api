import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) { }

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
      this.prisma.vendor.count({ where: { deletedAt: null } }),
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
    const where: any = { deletedAt: null };
    if (verified !== undefined) {
      where.verified = verified;
    }

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
            products: { where: { deletedAt: null } },
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
      where: { id: vendorId, deletedAt: null },
      include: {
        user: true,
        products: {
          where: { deletedAt: null },
        },
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
            products: { where: { deletedAt: null } },
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
      vendors.map(async (vendor: any) => {
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
    const where: any = { deletedAt: null };
    if (role) {
      where.role = role;
    }

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

  // Withdrawal Management
  async getPendingWithdrawals() {
    return this.prisma.withdrawalRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        stepper: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            wallet: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getAllWithdrawals(status?: string) {
    const where = status ? { status: status as any } : {};

    return this.prisma.withdrawalRequest.findMany({
      where,
      include: {
        stepper: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async approveWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
      include: { stepper: { include: { wallet: true } } },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot approve withdrawal with status: ${withdrawal.status}`,
      );
    }

    // Use transaction to atomically approve and deduct balance
    const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Verify wallet still has sufficient balance
      const wallet = await tx.wallet.findUnique({
        where: { stepperId: withdrawal.stepperId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (wallet.balance < withdrawal.amount) {
        throw new BadRequestException(
          `Insufficient balance. Required: GHC ${withdrawal.amount}, Available: GHC ${wallet.balance}`,
        );
      }

      // Deduct from wallet
      await tx.wallet.update({
        where: { stepperId: withdrawal.stepperId },
        data: {
          balance: { decrement: withdrawal.amount },
        },
      });

      // Mark withdrawal as approved
      return await tx.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: {
          status: 'APPROVED',
          processedAt: new Date(),
        },
      });
    });

    return {
      withdrawal: updated,
      message: `Withdrawal approved. GHC ${withdrawal.amount} has been deducted from stepper wallet.`,
    };
  }

  async rejectWithdrawal(withdrawalId: string, reason?: string) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot reject withdrawal with status: ${withdrawal.status}`,
      );
    }

    const updated = await this.prisma.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        status: 'REJECTED',
        processedAt: new Date(),
        // Store reason in a comment field if available, or just log it
      },
    });

    return {
      withdrawal: updated,
      message: `Withdrawal rejected.${reason ? ` Reason: ${reason}` : ''}`,
    };
  }
}
