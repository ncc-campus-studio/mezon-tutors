import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MezonCallbackQueryDto {
  @ApiProperty({
    description: 'Authorization code returned from Mezon OAuth',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'State parameter used to prevent CSRF attacks and link login session',
  })
  @IsString()
  state?: string;
}

