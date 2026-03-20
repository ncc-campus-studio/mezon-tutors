import { Type } from 'class-transformer'
import { IsInt, Min, Max, IsOptional } from 'class-validator'

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(100)
  limit: number = 10
}
