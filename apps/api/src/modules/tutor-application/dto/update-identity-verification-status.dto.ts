import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty } from 'class-validator';
import {
  type IdentityVerificationStatus,
  VALID_IDENTITY_VERIFICATION_STATUSES,
} from '@mezon-tutors/shared';

export class UpdateIdentityVerificationStatusDto {
  @ApiProperty({ enum: VALID_IDENTITY_VERIFICATION_STATUSES })
  @IsIn([...VALID_IDENTITY_VERIFICATION_STATUSES])
  @IsNotEmpty()
  status: IdentityVerificationStatus;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  nameMatch: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  notExpired: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  photoClarity: boolean;
}
