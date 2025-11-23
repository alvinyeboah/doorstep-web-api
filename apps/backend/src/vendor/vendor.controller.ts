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
import { VendorService } from './vendor.service';
import { RegisterVendorDto, UpdateVendorDto } from './dto/vendor.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post('register')
  async register(@CurrentUser() user: any, @Body() dto: RegisterVendorDto) {
    return this.vendorService.register(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateVendorDto) {
    return this.vendorService.updateProfile(user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('profile')
  async getMyProfile(@CurrentUser() user: any) {
    return this.vendorService.getMyProfile(user.id);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.vendorService.getProfile(id);
  }

  @Get('list')
  async getAllVendors(@Query('search') search?: string) {
    return this.vendorService.getAllVendors(search);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('orders')
  async getOrders(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.vendorService.getOrders(user.id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('analytics')
  async getAnalytics(@CurrentUser() user: any) {
    return this.vendorService.getAnalytics(user.id);
  }
}
