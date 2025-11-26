import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { R2Service } from '../common/services/r2.service';
import { PlunkService } from '../common/services/plunk.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, R2Service, PlunkService],
  exports: [UploadService],
})
export class UploadModule {}
