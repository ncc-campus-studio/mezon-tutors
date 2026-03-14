import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tutorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reviewerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reviewerName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
