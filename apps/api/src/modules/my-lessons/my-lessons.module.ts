import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MyLessonsController } from './my-lessons.controller';
import { MyLessonsService } from './my-lessons.service';

@Module({
  imports: [PrismaModule],
  controllers: [MyLessonsController],
  providers: [MyLessonsService],
  exports: [MyLessonsService],
})
export class MyLessonsModule {}
