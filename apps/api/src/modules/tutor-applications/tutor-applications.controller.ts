import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { TutorApplicationsService } from './tutor-applications.service';
import { TutorApplicationApproveBodyDto } from './dto/approve-body.dto';
import { TutorApplicationRejectBodyDto } from './dto/reject-body.dto';

@Controller('admin/tutor-applications')
@ApiTags('Admin - Tutor applications')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class TutorApplicationsController {
  constructor(private readonly tutorApplicationsService: TutorApplicationsService) {}

  @Get()
  async getList() {
    return this.tutorApplicationsService.listApplications();
  }

  @Get('metrics')
  async getMetrics() {
    return this.tutorApplicationsService.getMetrics();
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() body?: TutorApplicationApproveBodyDto) {
    return this.tutorApplicationsService.approve(id, body);
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() body?: TutorApplicationRejectBodyDto) {
    return this.tutorApplicationsService.reject(id, body);
  }
}
