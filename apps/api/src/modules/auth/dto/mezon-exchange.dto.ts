import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MezonExchangeDto {
  @ApiProperty({
    description: 'Authorization code returned from Mezon OAuth',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'State parameter from the authorization redirect; must match the value issued with /auth/url',
  })
  @IsString()
  @IsNotEmpty()
  state!: string;
}

