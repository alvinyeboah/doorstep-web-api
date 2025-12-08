import { Module } from '@nestjs/common';
import { StepperController } from './stepper.controller';
import { StepperService } from './stepper.service';
import { PlunkModule } from '../plunk/plunk.module';

@Module({
  imports: [PlunkModule],
  controllers: [StepperController],
  providers: [StepperService],
  exports: [StepperService],
})
export class StepperModule {}
