import { Module } from '@nestjs/common'
import { PayosModule } from '../payos/payos.module'
import { PrismaModule } from '../../prisma/prisma.module'
import { TrialLessonBookingController } from './trial-lesson-booking.controller'
import { TrialLessonBookingService } from './trial-lesson-booking.service'

@Module({
  imports: [PrismaModule, PayosModule],
  controllers: [TrialLessonBookingController],
  providers: [TrialLessonBookingService],
  exports: [TrialLessonBookingService],
})
export class TrialLessonBookingModule {}
