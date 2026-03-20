import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import {
  type ProfessionalDocumentStatus,
  VALID_PROFESSIONAL_DOCUMENT_STATUSES,
} from '@mezon-tutors/shared';

export class UpdateProfessionalDocumentStatusDto {
  @ApiProperty({ enum: VALID_PROFESSIONAL_DOCUMENT_STATUSES })
  @IsIn([...VALID_PROFESSIONAL_DOCUMENT_STATUSES])
  @IsNotEmpty()
  status: ProfessionalDocumentStatus;
}
