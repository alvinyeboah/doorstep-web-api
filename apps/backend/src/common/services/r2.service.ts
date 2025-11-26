import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

import { getErrorMessage } from '../../shared/utils/error.util';

export interface UploadOptions {
  bucket: string;
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly accountId: string;

  constructor(private configService: ConfigService) {
    this.accountId = this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID') || '';
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || '';

    const accessKeyId = this.configService.get<string>('CLOUDFLARE_ACCESS_KEY') || '';
    const secretAccessKey = this.configService.get<string>('CLOUDFLARE_SECRET_KEY') || '';

    if (!this.accountId || !accessKeyId || !secretAccessKey) {
      this.logger.warn('Cloudflare R2 configuration is missing - service will be disabled');
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('CLOUDFLARE_R2_URL') || `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    this.logger.log('Cloudflare R2 service initialized');
  }

  async uploadFile(options: UploadOptions): Promise<UploadResponse> {
    try {
      if (!this.accountId) {
        return {
          success: false,
          error: 'R2 service is not configured',
        };
      }

      const command = new PutObjectCommand({
        Bucket: options.bucket || this.bucketName,
        Key: options.key,
        Body: options.body,
        ContentType: options.contentType,
        Metadata: options.metadata,
      });

      await this.s3Client.send(command);

      const assetsBaseUrl = this.configService.get<string>('ASSETS_PUBLIC_BASE_URL') || `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com`;
      const url = `${assetsBaseUrl}/${options.key}`;

      this.logger.log(`File uploaded successfully: ${options.key}`);
      return {
        success: true,
        url,
        key: options.key,
      };
    } catch (error) {
      this.logger.error('R2 upload failed:', error);
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  async getFile(bucket: string, key: string): Promise<Buffer | null> {
    try {
      if (!this.accountId) {
        throw new Error('R2 service is not configured');
      }

      const command = new GetObjectCommand({
        Bucket: bucket || this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const chunks: Uint8Array[] = [];

      if (response.Body) {
        for await (const chunk of response.Body as any) {
          chunks.push(chunk);
        }
        return Buffer.concat(chunks);
      }

      return null;
    } catch (error) {
      this.logger.error('R2 get file failed:', error);
      return null;
    }
  }

  async deleteFile(bucket: string, key: string): Promise<boolean> {
    try {
      if (!this.accountId) {
        throw new Error('R2 service is not configured');
      }

      const command = new DeleteObjectCommand({
        Bucket: bucket || this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
      return true;
    } catch (error) {
      this.logger.error('R2 delete file failed:', error);
      return false;
    }
  }

  async listFiles(bucket: string, prefix?: string): Promise<string[]> {
    try {
      if (!this.accountId) {
        throw new Error('R2 service is not configured');
      }

      const command = new ListObjectsV2Command({
        Bucket: bucket || this.bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(command);
      return response.Contents?.map(obj => obj.Key || '') || [];
    } catch (error) {
      this.logger.error('R2 list files failed:', error);
      return [];
    }
  }

  async getSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    try {
      if (!this.accountId) {
        throw new Error('R2 service is not configured');
      }

      // Use the public CDN URL instead of signed URLs since the bucket is public
      const assetsBaseUrl = this.configService.get<string>('ASSETS_PUBLIC_BASE_URL') || `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com`;
      return `${assetsBaseUrl}/${key}`;
    } catch (error) {
      this.logger.error('R2 get signed URL failed:', error);
      throw error;
    }
  }

  /**
   * Upload food product images
   * Path structure: products/{vendor-slug}/{product-slug}/{filename}
   */
  async uploadProductImage(
    vendorSlug: string,
    productSlug: string,
    imageBuffer: Buffer,
    filename: string,
    contentType: string = 'image/jpeg'
  ): Promise<UploadResponse> {
    const key = `products/${vendorSlug}/${productSlug}/${filename}`;

    return await this.uploadFile({
      bucket: this.bucketName,
      key,
      body: imageBuffer,
      contentType,
      metadata: {
        vendorSlug,
        productSlug,
        type: 'product-image',
      },
    });
  }

  /**
   * Upload vendor logo
   * Path structure: vendors/{vendor-slug}/logo/{filename}
   */
  async uploadVendorLogo(
    vendorSlug: string,
    imageBuffer: Buffer,
    filename: string,
    contentType: string = 'image/jpeg'
  ): Promise<UploadResponse> {
    const key = `vendors/${vendorSlug}/logo/${filename}`;

    return await this.uploadFile({
      bucket: this.bucketName,
      key,
      body: imageBuffer,
      contentType,
      metadata: {
        vendorSlug,
        type: 'vendor-logo',
      },
    });
  }

  /**
   * Upload user avatar
   * Path structure: users/{userId}/avatar/{filename}
   */
  async uploadUserAvatar(
    userId: string,
    imageBuffer: Buffer,
    filename: string,
    contentType: string = 'image/jpeg'
  ): Promise<UploadResponse> {
    const key = `users/${userId}/avatar/${filename}`;

    return await this.uploadFile({
      bucket: this.bucketName,
      key,
      body: imageBuffer,
      contentType,
      metadata: {
        userId,
        type: 'user-avatar',
      },
    });
  }

  /**
   * Upload stepper documents (ID, license, etc.)
   * Path structure: steppers/{userId}/documents/{documentType}/{filename}
   */
  async uploadStepperDocument(
    userId: string,
    documentType: string,
    documentBuffer: Buffer,
    filename: string,
    contentType: string
  ): Promise<UploadResponse> {
    const key = `steppers/${userId}/documents/${documentType}/${filename}`;

    return await this.uploadFile({
      bucket: this.bucketName,
      key,
      body: documentBuffer,
      contentType,
      metadata: {
        userId,
        documentType,
        type: 'stepper-document',
      },
    });
  }

  /**
   * Upload order receipts
   * Path structure: orders/{orderId}/receipts/{filename}
   */
  async uploadOrderReceipt(
    orderId: string,
    receiptBuffer: Buffer,
    filename: string,
    contentType: string = 'image/jpeg'
  ): Promise<UploadResponse> {
    const key = `orders/${orderId}/receipts/${filename}`;

    return await this.uploadFile({
      bucket: this.bucketName,
      key,
      body: receiptBuffer,
      contentType,
      metadata: {
        orderId,
        type: 'order-receipt',
      },
    });
  }

  isConfigured(): boolean {
    return !!(this.accountId && this.bucketName);
  }
}
