import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { TutorApplicationsService } from './tutor-applications.service';

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
  async approve(@Param('id') id: string) {
    return this.tutorApplicationsService.approve(id);
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string) {
    return this.tutorApplicationsService.reject(id);
  }
}
