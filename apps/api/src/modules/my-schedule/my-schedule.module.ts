import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MyScheduleController } from './my-schedule.controller';
import { MyScheduleService } from './my-schedule.service';

@Module({
  imports: [PrismaModule],
  controllers: [MyScheduleController],
  providers: [MyScheduleService],
})
export class MyScheduleModule {}
