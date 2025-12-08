import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiExcludeController() // Exclude from Swagger since we have /api/docs
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `DoorStep API - Access documentation at /api/docs`;
  }
}
