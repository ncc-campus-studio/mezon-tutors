import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetDmChannelQueryDto, MyDmChannelItemDto, UpsertDmChannelDto } from './dto/dm-channel.dto';

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

  async getMyChannels(userId: string): Promise<MyDmChannelItemDto[]> {
    const channels = await this.prisma.userDmChannel.findMany({
      where: {
        studentId: userId,
      },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            avatar: true,
            mezonUserId: true,
          },
        },
        tutor: {
          select: {
            id: true,
            username: true,
            avatar: true,
            mezonUserId: true,
            tutorProfile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return channels.map((channel) => {
      const tutor = channel.tutor;
      return {
        id: channel.id,
        channelId: channel.channelId,
        studentId: channel.studentId,
        tutorId: channel.tutorId,
        peerId: tutor.id,
        peerName: `${tutor.tutorProfile?.firstName} ${tutor.tutorProfile?.lastName}`,
        peerAvatar: tutor.avatar,
        peerMezonUserId: tutor.mezonUserId,
        updatedAt: channel.updatedAt,
      };
    });
  }
}
