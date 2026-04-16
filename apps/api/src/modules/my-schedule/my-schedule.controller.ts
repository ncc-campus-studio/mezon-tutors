import { Controller, Get, Query } from '@nestjs/common';
import { MyScheduleService } from './my-schedule.service';

@Controller('my-schedule')
export class MyScheduleController {
  constructor(private readonly myScheduleService: MyScheduleService) {}

  @Get()
  async getMySchedule(
    @Query('tutor_mezon_user_id') tutorMezonUserId?: string,
    @Query('week_start_date') weekStartDate?: string,
  ) {
    return this.myScheduleService.getMySchedule(tutorMezonUserId, weekStartDate);
  }
}
