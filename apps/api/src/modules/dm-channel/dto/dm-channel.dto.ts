import { IsString, IsUUID } from 'class-validator';

export class UpsertDmChannelDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  tutorId: string;

  @IsString()
  channelId: string;
}

export class GetDmChannelQueryDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  tutorId: string;
}

export class MyDmChannelItemDto {
  id: string;
  channelId: string;
  studentId: string;
  tutorId: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  peerMezonUserId: string;
  updatedAt: Date;
}
