import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetDmChannelQueryDto, UpsertDmChannelDto } from './dto/dm-channel.dto';
import { DmChannelService } from './dm-channel.service';

@Controller('dm-channels')
@ApiTags('DM Channels')
@UseGuards(JwtAuthGuard)
export class DmChannelController {
  constructor(private readonly dmChannelService: DmChannelService) {}

  @Get()
  async getDmChannel(@Query() query: GetDmChannelQueryDto) {
    return this.dmChannelService.getChannel(query);
  }

  @Post()
  async upsertDmChannel(@Body() dto: UpsertDmChannelDto) {
    return this.dmChannelService.upsertChannel(dto);
  }
}
