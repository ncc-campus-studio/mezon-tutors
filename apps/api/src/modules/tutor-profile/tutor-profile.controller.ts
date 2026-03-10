import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import type { AuthUserPayload } from '../auth/interfaces/auth.interfaces';
import type { SubmitTutorProfileDto } from '@mezon-tutors/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TutorProfileService } from './tutor-profile.service';

@Controller('tutor-profiles')
@ApiTags('Tutor Profile')
export class TutorProfileController {
  constructor(private readonly tutorProfileService: TutorProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async HandleSubmitTutorProfile(@Req() req: Request, @Body() body: SubmitTutorProfileDto) {
    const user = req.user as AuthUserPayload;
    await this.tutorProfileService.createByUserId(user.sub, body);
    return { success: true };
  }
}
