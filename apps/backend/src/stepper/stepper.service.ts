import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  RegisterStepperDto,
  UpdateStepperDto,
  DepositDto,
  WithdrawalRequestDto,
} from './dto/stepper.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';
import {
  calculateDistance,
  geoJSONToLocation,
  type Location,
  type GeoJSONPoint,
} from '../common/utils/geolocation.utils';
import { PlunkService } from '../plunk/plunk.service';

@Injectable()
export class StepperService {
  constructor(
    private prisma: PrismaService,
    private plunkService: PlunkService,
  ) { }

  async register(userId: string, dto: RegisterStepperDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'STEPPER') {
      throw new ForbiddenException('Only steppers can register as steppers');
    }

    const existingStepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (existingStepper) {
      throw new ForbiddenException('Stepper profile already exists');
    }

    const stepper = await this.prisma.stepper.create({
      data: {
        userId,
        studentIdUrl: dto.studentIdUrl,
        governmentIdUrl: dto.governmentIdUrl,
        bankDetails: dto.bankDetails as any,
        emergencyContact: dto.emergencyContact as any,
        pictureUrl: dto.pictureUrl,
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

    // Create wallet for stepper
    await this.prisma.wallet.create({
      data: { stepperId: stepper.id },
    });

    // Send welcome email
    try {
      await this.plunkService.sendStepperWelcome(user.email, user.name);
    } catch (error) {
      // Don't fail registration if email fails
      console.error('Failed to send welcome email:', error);
    }

    return {
      stepper,
      message: 'Stepper registered successfully',
    };
  }

  async updateProfile(userId: string, dto: UpdateStepperDto) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const updated = await this.prisma.stepper.update({
      where: { userId },
      data: dto,
    });

    return {
      stepper: updated,
      message: 'Profile updated successfully',
    };
  }

  async getProfile(userId: string) {
    const stepper = await this.prisma.stepper.findUnique({
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
        wallet: true,
        _count: {
          select: {
            orders: true,
            commissionHistory: true,
          },
        },
      },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    return stepper;
  }

  async updateAvailability(userId: string, available: boolean) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const updated = await this.prisma.stepper.update({
      where: { userId },
      data: { available },
    });

    return {
      available: updated.available,
      message: `Status updated to ${available ? 'available' : 'unavailable'}`,
    };
  }

  async getOrders(userId: string, status?: string, page = 1, limit = 20) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const where: any = { stepperId: stepper.id };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
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
          vendor: {
            select: {
              id: true,
              shopName: true,
              address: true,
              location: true,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return createPaginatedResponse(orders, total, page, limit);
  }

  // Wallet Operations
  async getWallet(userId: string) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
      include: { wallet: true },
    });

    if (!stepper || !stepper.wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return stepper.wallet;
  }

  async makeDeposit(userId: string, dto: DepositDto) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
      include: { wallet: true },
    });

    if (!stepper || !stepper.wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const updated = await this.prisma.wallet.update({
      where: { id: stepper.wallet.id },
      data: {
        depositAmount: {
          increment: dto.amount,
        },
      },
    });

    return {
      wallet: updated,
      message: 'Deposit successful',
    };
  }

  async requestWithdrawal(userId: string, dto: WithdrawalRequestDto) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
      include: { wallet: true, user: true },
    });

    if (!stepper || !stepper.wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Use transaction to atomically check balance and create request
    const request = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get current wallet state
      const wallet = await tx.wallet.findUnique({
        where: { id: stepper.wallet!.id },
      });

      if (!wallet) {
        throw new Error('Wallet not found for transaction');
      }

      // Calculate total pending withdrawals
      const pendingWithdrawals = await tx.withdrawalRequest.aggregate({
        where: {
          stepperId: stepper.id,
          status: 'PENDING',
        },
        _sum: { amount: true },
      });

      const totalPending = pendingWithdrawals._sum.amount || 0;
      const availableBalance = wallet!.balance - totalPending;

      if (availableBalance < dto.amount) {
        throw new BadRequestException(
          `Insufficient available balance. Available: GHC ${availableBalance}, Pending withdrawals: GHC ${totalPending}`,
        );
      }

      const twoFactorCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      // Create withdrawal request atomically
      return await tx.withdrawalRequest.create({
        data: {
          stepperId: stepper.id,
          amount: dto.amount,
          twoFactorCode,
          status: 'PENDING',
        },
      });
    });

    // Send 2FA code via email (outside transaction)
    try {
      await this.plunkService.send2FACode(
        stepper.user.email,
        request.twoFactorCode!,
        dto.amount,
      );
    } catch (error) {
      console.error('Failed to send 2FA email:', error);
      // Continue anyway - code is in the response as fallback
    }

    return {
      request,
      message:
        'Withdrawal request created. Check your email for the 2FA verification code.',
    };
  }

  async getWithdrawalRequests(userId: string, page = 1, limit = 20) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const where = { stepperId: stepper.id };

    const [requests, total] = await Promise.all([
      this.prisma.withdrawalRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.withdrawalRequest.count({ where }),
    ]);

    return createPaginatedResponse(requests, total, page, limit);
  }

  async getCommissionHistory(userId: string, page = 1, limit = 20) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const where = { stepperId: stepper.id };

    const [history, total] = await Promise.all([
      this.prisma.commissionHistory.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              total: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.commissionHistory.count({ where }),
    ]);

    return createPaginatedResponse(history, total, page, limit);
  }

  async getNearbySteppers(latitude: number, longitude: number, radiusKm = 10) {
    const origin: Location = { latitude, longitude };

    // Find all available and verified steppers
    const steppers = await this.prisma.stepper.findMany({
      where: {
        available: true,
        verified: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Filter steppers with location data and calculate distances
    type StepperWithUser = typeof steppers[number];
    type StepperWithDistance = {
      id: string;
      name: string;
      phone: string | null;
      rating: number | null;
      pictureUrl: string | null;
      location: any;
      distance: number;
      verified: boolean;
    };

    const steppersWithDistance = steppers
      .filter((stepper: StepperWithUser) => stepper.location !== null)
      .map((stepper: StepperWithUser): StepperWithDistance => {
        const stepperLocation = geoJSONToLocation(
          stepper.location as unknown as GeoJSONPoint,
        );
        const distance = calculateDistance(origin, stepperLocation);

        return {
          id: stepper.id,
          name: stepper.user.name,
          phone: stepper.user.phone,
          rating: stepper.rating,
          pictureUrl: stepper.pictureUrl,
          location: stepper.location,
          distance: distance,
          verified: stepper.verified,
        };
      })
      .filter((stepper: StepperWithDistance) => stepper.distance <= radiusKm)
      .sort((a: StepperWithDistance, b: StepperWithDistance) => a.distance - b.distance);

    return {
      steppers: steppersWithDistance,
      count: steppersWithDistance.length,
      searchRadius: radiusKm,
      searchLocation: { latitude, longitude },
    };
  }
}
