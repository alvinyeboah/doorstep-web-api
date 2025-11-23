import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('super-admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('analytics')
  async getPlatformAnalytics() {
    return this.superAdminService.getPlatformAnalytics();
  }

  @Get('vendors')
  async getAllVendors(@Query('verified') verified?: string) {
    const verifiedBool = verified === 'true' ? true : verified === 'false' ? false : undefined;
    return this.superAdminService.getAllVendors(verifiedBool);
  }

  @Get('vendors/:id')
  async getVendorDetails(@Param('id') id: string) {
    return this.superAdminService.getVendorDetails(id);
  }

  @Put('vendors/:id/status')
  async updateVendorStatus(
    @Param('id') id: string,
    @Body() body: { verified: boolean },
  ) {
    return this.superAdminService.updateVendorStatus(id, body.verified);
  }

  @Get('orders')
  async getAllOrders(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    return this.superAdminService.getAllOrders(status, limit ? parseInt(limit) : 100);
  }

  @Get('revenue/by-vendor')
  async getRevenueByVendor() {
    return this.superAdminService.getRevenueByVendor();
  }

  @Get('users')
  async getAllUsers(@Query('role') role?: string) {
    return this.superAdminService.getAllUsers(role);
  }
}
