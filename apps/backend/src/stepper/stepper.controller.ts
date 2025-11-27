import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StepperService } from './stepper.service';
import {
  RegisterStepperDto,
  UpdateStepperDto,
  DepositDto,
  WithdrawalRequestDto,
  UpdateAvailabilityDto,
} from './dto/stepper.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('stepper')
export class StepperController {
  constructor(private readonly stepperService: StepperService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('register')
  async register(@CurrentUser() user: any, @Body() dto: RegisterStepperDto) {
    return this.stepperService.register(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateStepperDto) {
    return this.stepperService.updateProfile(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.stepperService.getProfile(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Put('availability')
  async updateAvailability(
    @CurrentUser() user: any,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.stepperService.updateAvailability(user.id, dto.available);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('orders')
  async getOrders(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.stepperService.getOrders(user.id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('wallet')
  async getWallet(@CurrentUser() user: any) {
    return this.stepperService.getWallet(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('deposit')
  async makeDeposit(@CurrentUser() user: any, @Body() dto: DepositDto) {
    return this.stepperService.makeDeposit(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('withdrawal')
  async requestWithdrawal(
    @CurrentUser() user: any,
    @Body() dto: WithdrawalRequestDto,
  ) {
    return this.stepperService.requestWithdrawal(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('withdrawals')
  async getWithdrawalRequests(@CurrentUser() user: any) {
    return this.stepperService.getWithdrawalRequests(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('commission-history')
  async getCommissionHistory(@CurrentUser() user: any) {
    return this.stepperService.getCommissionHistory(user.id);
  }
}
