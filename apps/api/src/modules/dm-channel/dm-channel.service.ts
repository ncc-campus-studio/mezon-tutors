import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetDmChannelQueryDto, UpsertDmChannelDto } from './dto/dm-channel.dto';

@Injectable()
export class DmChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertChannel(dto: UpsertDmChannelDto) {
    return this.prisma.userDmChannel.upsert({
      where: {
        studentId_tutorId: {
          studentId: dto.studentId,
          tutorId: dto.tutorId,
        },
      },
      create: {
        studentId: dto.studentId,
        tutorId: dto.tutorId,
        channelId: dto.channelId,
      },
      update: {
        channelId: dto.channelId,
      },
    });
  }

  async getChannel(query: GetDmChannelQueryDto) {
    return this.prisma.userDmChannel.findUnique({
      where: {
        studentId_tutorId: {
          studentId: query.studentId,
          tutorId: query.tutorId,
        },
      },
    });
  }
}
