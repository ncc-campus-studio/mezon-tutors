import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TutorApplicationController } from './tutor-application.controller';
import { TutorApplicationService } from './tutor-application.service';
import { TutorApplicationMapper } from './tutor-application.mapper';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TutorApplicationController],
  providers: [TutorApplicationService, TutorApplicationMapper],
  exports: [TutorApplicationService, TutorApplicationMapper],
})
export class TutorApplicationModule {}
