import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { R2Service } from '../common/services/r2.service';
import { v4 as uuidv4 } from 'uuid';

export interface UploadFileResult {
  url: string;
  key: string;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly maxFileSize: number;
  private readonly allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  private readonly allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  constructor(
    private readonly r2Service: R2Service,
    private readonly configService: ConfigService,
  ) {
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE') || 5242880; // 5MB default
  }

  /**
   * Upload product image to R2
   */
  async uploadProductImage(
    vendorSlug: string,
    productSlug: string,
    file: Express.Multer.File,
  ): Promise<UploadFileResult> {
    this.validateImage(file);

    const filename = this.generateFilename(file.originalname);
    const result = await this.r2Service.uploadProductImage(
      vendorSlug,
      productSlug,
      file.buffer,
      filename,
      file.mimetype,
    );

    if (!result.success || !result.url) {
      throw new BadRequestException(result.error || 'Failed to upload product image');
    }

    return {
      url: result.url,
      key: result.key!,
    };
  }

  /**
   * Upload vendor logo to R2
   */
  async uploadVendorLogo(
    vendorSlug: string,
    file: Express.Multer.File,
  ): Promise<UploadFileResult> {
    this.validateImage(file);

    const filename = this.generateFilename(file.originalname);
    const result = await this.r2Service.uploadVendorLogo(
      vendorSlug,
      file.buffer,
      filename,
      file.mimetype,
    );

    if (!result.success || !result.url) {
      throw new BadRequestException(result.error || 'Failed to upload vendor logo');
    }

    return {
      url: result.url,
      key: result.key!,
    };
  }

  /**
   * Upload user avatar to R2
   */
  async uploadUserAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UploadFileResult> {
    this.validateImage(file);

    const filename = this.generateFilename(file.originalname);
    const result = await this.r2Service.uploadUserAvatar(
      userId,
      file.buffer,
      filename,
      file.mimetype,
    );

    if (!result.success || !result.url) {
      throw new BadRequestException(result.error || 'Failed to upload user avatar');
    }

    return {
      url: result.url,
      key: result.key!,
    };
  }

  /**
   * Upload stepper document (ID, license, etc.) to R2
   */
  async uploadStepperDocument(
    userId: string,
    documentType: string,
    file: Express.Multer.File,
  ): Promise<UploadFileResult> {
    this.validateDocument(file);

    const filename = this.generateFilename(file.originalname);
    const result = await this.r2Service.uploadStepperDocument(
      userId,
      documentType,
      file.buffer,
      filename,
      file.mimetype,
    );

    if (!result.success || !result.url) {
      throw new BadRequestException(result.error || 'Failed to upload stepper document');
    }

    return {
      url: result.url,
      key: result.key!,
    };
  }

  /**
   * Upload order receipt to R2
   */
  async uploadOrderReceipt(
    orderId: string,
    file: Express.Multer.File,
  ): Promise<UploadFileResult> {
    this.validateImage(file);

    const filename = this.generateFilename(file.originalname);
    const result = await this.r2Service.uploadOrderReceipt(
      orderId,
      file.buffer,
      filename,
      file.mimetype,
    );

    if (!result.success || !result.url) {
      throw new BadRequestException(result.error || 'Failed to upload order receipt');
    }

    return {
      url: result.url,
      key: result.key!,
    };
  }

  /**
   * Validate image file
   */
  private validateImage(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedImageTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      const maxSizeMB = this.maxFileSize / 1024 / 1024;
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      );
    }
  }

  /**
   * Validate document file
   */
  private validateDocument(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedDocumentTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedDocumentTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      const maxSizeMB = this.maxFileSize / 1024 / 1024;
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      );
    }
  }

  /**
   * Generate unique filename with timestamp
   */
  private generateFilename(originalName: string): string {
    const ext = originalName.split('.').pop();
    const timestamp = Date.now();
    const uuid = uuidv4().split('-')[0]; // Use first part of UUID for brevity
    return `${timestamp}-${uuid}.${ext}`;
  }

  /**
   * Check if R2 service is configured
   */
  isConfigured(): boolean {
    return this.r2Service.isConfigured();
  }
}
