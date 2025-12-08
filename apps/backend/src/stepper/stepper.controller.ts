import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
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
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('steppers')
@Controller('stepper')
export class StepperController {
  constructor(private readonly stepperService: StepperService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register as a stepper',
    description: 'User with stepper role registers as a delivery person',
  })
  @ApiResponse({
    status: 201,
    description: 'Stepper profile created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data or already registered',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async register(@CurrentUser() user: any, @Body() dto: RegisterStepperDto) {
    return this.stepperService.register(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update stepper profile',
    description: 'Stepper updates their profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'Stepper profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Stepper profile not found',
  })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateStepperDto) {
    return this.stepperService.updateProfile(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my stepper profile',
    description: 'Stepper retrieves their own profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Stepper profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Stepper profile not found',
  })
  async getProfile(@CurrentUser() user: any) {
    return this.stepperService.getProfile(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Put('availability')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update availability status',
    description: 'Stepper toggles their availability for accepting deliveries',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async updateAvailability(
    @CurrentUser() user: any,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.stepperService.updateAvailability(user.id, dto.available);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('orders')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get stepper orders',
    description: 'Stepper retrieves their delivery orders with optional status filter and pagination',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter by order status',
    example: 'OUT_FOR_DELIVERY',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number (1-based)',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    example: 20,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully with pagination',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async getOrders(@CurrentUser() user: any, @Query() pagination: PaginationDto, @Query('status') status?: string) {
    return this.stepperService.getOrders(user.id, status, pagination.page, pagination.limit);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('wallet')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get wallet balance',
    description: 'Stepper retrieves their wallet balance and transaction history',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet information retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async getWallet(@CurrentUser() user: any) {
    return this.stepperService.getWallet(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('deposit')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Make a deposit',
    description: 'Stepper makes a deposit to their wallet',
  })
  @ApiResponse({
    status: 201,
    description: 'Deposit successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid amount',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async makeDeposit(@CurrentUser() user: any, @Body() dto: DepositDto) {
    return this.stepperService.makeDeposit(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('withdrawal')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Request a withdrawal',
    description: 'Stepper requests to withdraw funds from their wallet',
  })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal request created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - insufficient funds or invalid amount',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async requestWithdrawal(
    @CurrentUser() user: any,
    @Body() dto: WithdrawalRequestDto,
  ) {
    return this.stepperService.requestWithdrawal(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('withdrawals')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get withdrawal requests',
    description: 'Stepper retrieves their withdrawal request history',
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal requests retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async getWithdrawalRequests(@CurrentUser() user: any) {
    return this.stepperService.getWithdrawalRequests(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Get('commission-history')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get commission history',
    description: 'Stepper retrieves their delivery commission earnings history',
  })
  @ApiResponse({
    status: 200,
    description: 'Commission history retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
  async getCommissionHistory(@CurrentUser() user: any) {
    return this.stepperService.getCommissionHistory(user.id);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Get nearby available steppers',
    description:
      'Find available and verified steppers near a location for delivery. Public endpoint - no authentication required.',
  })
  @ApiQuery({
    name: 'latitude',
    description: 'Latitude of the location',
    example: 5.7597,
    required: true,
  })
  @ApiQuery({
    name: 'longitude',
    description: 'Longitude of the location',
    example: -0.227,
    required: true,
  })
  @ApiQuery({
    name: 'radius',
    description: 'Search radius in kilometers (default: 10km)',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Nearby steppers retrieved successfully, sorted by distance',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid coordinates',
  })
  async getNearbySteppers(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius?: string,
  ) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusKm = radius ? parseFloat(radius) : 10;

    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Invalid latitude or longitude');
    }

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }

    return this.stepperService.getNearbySteppers(lat, lng, radiusKm);
  }
}
