import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthHandlerController } from './auth-handler.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController, AuthHandlerController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
