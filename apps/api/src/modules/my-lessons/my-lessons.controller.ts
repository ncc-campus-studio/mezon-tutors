import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MyLessonsService } from './my-lessons.service';

@Controller('my-lessons')
@ApiTags('My Lessons')
export class MyLessonsController {
  constructor(private readonly myLessonsService: MyLessonsService) {}

  @Get()
  async getOverview(@Query('student_mezon_user_id') studentMezonUserId?: string) {
    return this.myLessonsService.getOverview(studentMezonUserId);
  }
}
