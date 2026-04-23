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
