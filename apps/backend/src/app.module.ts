import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';
import { ProductsModule } from './products/products.module';
import { CustomerModule } from './customer/customer.module';
import { StepperModule } from './stepper/stepper.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { UploadModule } from './upload/upload.module';
import { PaymentsModule } from './payments/payments.module';
import { PlunkModule } from './plunk/plunk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    VendorModule,
    ProductsModule,
    CustomerModule,
    StepperModule,
    OrdersModule,
    NotificationsModule,
    SuperAdminModule,
    UploadModule,
    PaymentsModule,
    PlunkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
