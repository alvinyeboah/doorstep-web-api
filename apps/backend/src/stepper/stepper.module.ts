import { Module } from '@nestjs/common';
import { StepperController } from './stepper.controller';
import { StepperService } from './stepper.service';

@Module({
  controllers: [StepperController],
  providers: [StepperService],
  exports: [StepperService],
})
export class StepperModule {}
