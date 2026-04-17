import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TutorAvailabilityController } from './tutor-availability.controller';
import { TutorAvailabilityService } from './tutor-availability.service';

@Module({
  imports: [PrismaModule],
  controllers: [TutorAvailabilityController],
  providers: [TutorAvailabilityService],
  exports: [TutorAvailabilityService],
})
export class TutorAvailabilityModule {}
