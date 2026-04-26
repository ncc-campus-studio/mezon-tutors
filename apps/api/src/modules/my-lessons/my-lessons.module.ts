import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MyLessonsController } from './my-lessons.controller';
import { MyLessonsService } from './my-lessons.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MyLessonsController],
  providers: [MyLessonsService],
  exports: [MyLessonsService],
})
export class MyLessonsModule {}
