import { IsEnum, IsOptional } from 'class-validator'
import { TutorSortBy } from '@mezon-tutors/shared'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class VerifiedTutorQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TutorSortBy)
  sortBy: TutorSortBy = TutorSortBy.POPULARITY
}
