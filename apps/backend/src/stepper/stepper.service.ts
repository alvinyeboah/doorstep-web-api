import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterStepperDto,
  UpdateStepperDto,
  DepositDto,
  WithdrawalRequestDto,
} from './dto/stepper.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class StepperService {
  constructor(private prisma: PrismaService) {}

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
      include: { wallet: true },
    });

    if (!stepper || !stepper.wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (stepper.wallet.balance < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const twoFactorCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const request = await this.prisma.withdrawalRequest.create({
      data: {
        stepperId: stepper.id,
        amount: dto.amount,
        twoFactorCode,
        status: 'PENDING',
      },
    });

    return {
      request,
      twoFactorCode, // In production, send via SMS/email
      message: 'Withdrawal request created. Use the 2FA code to confirm.',
    };
  }

  async getWithdrawalRequests(userId: string) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const requests = await this.prisma.withdrawalRequest.findMany({
      where: { stepperId: stepper.id },
      orderBy: { createdAt: 'desc' },
    });

    return requests;
  }

  async getCommissionHistory(userId: string) {
    const stepper = await this.prisma.stepper.findUnique({
      where: { userId },
    });

    if (!stepper) {
      throw new NotFoundException('Stepper profile not found');
    }

    const history = await this.prisma.commissionHistory.findMany({
      where: { stepperId: stepper.id },
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
    });

    return history;
  }
}
