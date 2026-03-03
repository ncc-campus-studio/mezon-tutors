import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MezonExchangeDto {
  @ApiProperty({
    description: 'Authorization code returned from Mezon OAuth',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'Optional state parameter used to prevent CSRF attacks and link login session',
    required: false,
  })
  @IsString()
  @IsOptional()
  state?: string;
}

