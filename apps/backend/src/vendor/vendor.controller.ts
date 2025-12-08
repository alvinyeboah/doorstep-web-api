import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { RegisterVendorDto, UpdateVendorDto } from './dto/vendor.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('vendors')
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register as a vendor',
    description: 'User with vendor role registers their business profile',
  })
  @ApiResponse({
    status: 201,
    description: 'Vendor profile created successfully',
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
    description: 'Forbidden - vendor role required',
  })
  async register(@CurrentUser() user: any, @Body() dto: RegisterVendorDto) {
    return this.vendorService.register(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update vendor profile',
    description: 'Vendor updates their business profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor profile updated successfully',
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
    description: 'Forbidden - vendor role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor profile not found',
  })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateVendorDto) {
    return this.vendorService.updateProfile(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my vendor profile',
    description: 'Vendor retrieves their own business profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - vendor role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor profile not found',
  })
  async getMyProfile(@CurrentUser() user: any) {
    return this.vendorService.getMyProfile(user.id);
  }

  @Get('profile/:id')
  @ApiOperation({
    summary: 'Get vendor profile by ID',
    description: 'Retrieve public vendor profile information',
  })
  @ApiParam({
    name: 'id',
    description: 'Vendor ID',
    example: 'clp456xyz789abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor profile retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor not found',
  })
  async getProfile(@Param('id') id: string) {
    return this.vendorService.getProfile(id);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get all vendors',
    description: 'Retrieve list of all vendors with optional search filter and pagination',
  })
  @ApiQuery({
    name: 'search',
    description: 'Search query for vendor name or business type',
    example: 'restaurant',
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
    description: 'Vendors retrieved successfully with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'object' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 45 },
            totalPages: { type: 'number', example: 3 },
            hasNextPage: { type: 'boolean', example: true },
            hasPreviousPage: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  async getAllVendors(@Query() pagination: PaginationDto, @Query('search') search?: string) {
    return this.vendorService.getAllVendors(search, pagination.page, pagination.limit);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('orders')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get vendor orders',
    description: 'Vendor retrieves their orders with optional status filter and pagination',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter by order status',
    example: 'PREPARING',
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
    description: 'Forbidden - vendor role required',
  })
  async getOrders(@CurrentUser() user: any, @Query() pagination: PaginationDto, @Query('status') status?: string) {
    return this.vendorService.getOrders(user.id, status, pagination.page, pagination.limit);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('analytics')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get vendor analytics',
    description: 'Vendor retrieves business analytics and statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - vendor role required',
  })
  async getAnalytics(@CurrentUser() user: any) {
    return this.vendorService.getAnalytics(user.id);
  }
}
