import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlunkService } from './plunk.service';

@Module({
  imports: [ConfigModule],
  providers: [PlunkService],
  exports: [PlunkService],
})
export class PlunkModule {}
