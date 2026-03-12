import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TutorApplicationsController } from './tutor-applications.controller';
import { TutorApplicationsService } from './tutor-applications.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TutorApplicationsController],
  providers: [TutorApplicationsService],
  exports: [TutorApplicationsService],
})
export class TutorApplicationsModule {}
