import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { ECountry, ESubject, ETutorSortBy } from '@mezon-tutors/shared'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class VerifiedTutorQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ETutorSortBy)
  sortBy: ETutorSortBy = ETutorSortBy.POPULARITY

  @IsOptional()
  @IsEnum(ESubject)
  subject?: ESubject

  @IsOptional()
  @IsEnum(ECountry)
  country?: ECountry

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number
}
