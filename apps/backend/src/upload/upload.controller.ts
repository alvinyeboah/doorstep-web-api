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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post('product-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload product image',
    description: 'Vendor uploads an image for their product',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'vendorSlug', 'productSlug'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },
        vendorSlug: {
          type: 'string',
          description: 'Vendor slug identifier',
          example: 'campus-bites-restaurant',
        },
        productSlug: {
          type: 'string',
          description: 'Product slug identifier',
          example: 'jollof-rice-chicken',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required fields or invalid file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - vendor role required',
  })
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post('vendor-logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload vendor logo',
    description: 'Vendor uploads their business logo',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'vendorSlug'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Vendor logo image file',
        },
        vendorSlug: {
          type: 'string',
          description: 'Vendor slug identifier',
          example: 'campus-bites-restaurant',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Logo uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required fields or invalid file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - vendor role required',
  })
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

  @UseGuards(AuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload user avatar',
    description: 'User uploads their profile avatar image',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STEPPER')
  @Post('stepper-document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload stepper document',
    description: 'Stepper uploads verification documents (ID, license, etc.)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'documentType'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file (PDF or image)',
        },
        documentType: {
          type: 'string',
          description: 'Type of document being uploaded',
          example: 'government-id',
          enum: ['student-id', 'government-id', 'driver-license', 'proof-of-vehicle'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required fields or invalid file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - stepper role required',
  })
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CUSTOMER', 'STEPPER')
  @Post('order-receipt')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload order receipt',
    description: 'Customer or stepper uploads a receipt for an order',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'orderId'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Receipt image file',
        },
        orderId: {
          type: 'string',
          description: 'Order ID',
          example: 'clp123abc456def',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Receipt uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required fields or invalid file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - customer or stepper role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
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

  @Post('status')
  @ApiOperation({
    summary: 'Check upload service status',
    description: 'Check if the upload service is configured and ready',
  })
  @ApiResponse({
    status: 200,
    description: 'Upload service status retrieved',
    schema: {
      type: 'object',
      properties: {
        configured: {
          type: 'boolean',
          description: 'Whether the upload service is configured',
        },
        message: {
          type: 'string',
          description: 'Status message',
        },
      },
    },
  })
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
