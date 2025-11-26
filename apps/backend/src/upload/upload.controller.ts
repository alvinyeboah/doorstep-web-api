import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload product image (Vendor only)
   * POST /upload/product-image
   * Body: { vendorSlug: string, productSlug: string }
   * File: image file
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post('product-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @CurrentUser() user: any,
    @Body('vendorSlug') vendorSlug: string,
    @Body('productSlug') productSlug: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!vendorSlug || !productSlug) {
      throw new BadRequestException('vendorSlug and productSlug are required');
    }

    const result = await this.uploadService.uploadProductImage(
      vendorSlug,
      productSlug,
      file,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Upload vendor logo (Vendor only)
   * POST /upload/vendor-logo
   * Body: { vendorSlug: string }
   * File: image file
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post('vendor-logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVendorLogo(
    @CurrentUser() user: any,
    @Body('vendorSlug') vendorSlug: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!vendorSlug) {
      throw new BadRequestException('vendorSlug is required');
    }

    const result = await this.uploadService.uploadVendorLogo(vendorSlug, file);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Upload user avatar (All authenticated users)
   * POST /upload/avatar
   * File: image file
   */
  @UseGuards(AuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadUserAvatar(user.id, file);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Upload stepper document (Stepper only)
   * POST /upload/stepper-document
   * Body: { documentType: string } (e.g., 'id', 'license', 'proof-of-vehicle')
   * File: document file (PDF or image)
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('stepper-document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStepperDocument(
    @CurrentUser() user: any,
    @Body('documentType') documentType: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!documentType) {
      throw new BadRequestException('documentType is required');
    }

    const result = await this.uploadService.uploadStepperDocument(
      user.id,
      documentType,
      file,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Upload order receipt (Customer or Stepper)
   * POST /upload/order-receipt
   * Body: { orderId: string }
   * File: image file
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER', 'STEPPER')
  @Post('order-receipt')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOrderReceipt(
    @CurrentUser() user: any,
    @Body('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!orderId) {
      throw new BadRequestException('orderId is required');
    }

    const result = await this.uploadService.uploadOrderReceipt(orderId, file);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Check if upload service is configured
   * GET /upload/status
   */
  @Post('status')
  async getUploadStatus() {
    const isConfigured = this.uploadService.isConfigured();

    return {
      configured: isConfigured,
      message: isConfigured
        ? 'Upload service is ready'
        : 'Upload service is not configured - missing R2 credentials',
    };
  }
}
