import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
