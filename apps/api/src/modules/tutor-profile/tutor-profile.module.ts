import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TutorProfileController } from './tutor-profile.controller';
import { TutorProfileService } from './tutor-profile.service';

@Module({
  imports: [PrismaModule],
  controllers: [TutorProfileController],
  providers: [TutorProfileService],
  exports: [TutorProfileService],
})
export class TutorProfileModule {}
