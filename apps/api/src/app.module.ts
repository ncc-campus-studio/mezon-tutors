import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';
import { HealthController } from './health.controller';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { TutorProfileModule } from './modules/tutor-profile/tutor-profile.module';
import { TutorAvailabilityModule } from './modules/tutor-availability/tutor-availability.module';
import { MyLessonsModule } from './modules/my-lessons/my-lessons.module';
import { TutorApplicationModule } from './modules/tutor-application/tutor-application.module';
import { TrialLessonBookingModule } from './modules/trial-lesson-booking/trial-lesson-booking.module';
import { PayosWebhookModule } from './modules/payos-webhook/payos-webhook.module';
import { MyScheduleModule } from './modules/my-schedule/my-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    PrismaModule,
    AuthModule,
    TutorProfileModule,
    TutorAvailabilityModule,
    TutorApplicationModule,
    MyLessonsModule,
    TrialLessonBookingModule,
    PayosWebhookModule,
    MyScheduleModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
