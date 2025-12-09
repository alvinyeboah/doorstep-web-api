import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
    // Rate Limiting: 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests
      },
      {
        name: 'strict', // For sensitive endpoints
        ttl: 60000,
        limit: 10,
      },
    ]),
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
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Apply rate limiting globally
    },
  ],
})
export class AppModule {}
