import { IsEnum, IsOptional } from 'class-validator'
import { ETrialLessonStatus } from '@mezon-tutors/db'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class GetMyTrialLessonBookingsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ETrialLessonStatus)
  status?: ETrialLessonStatus
}
