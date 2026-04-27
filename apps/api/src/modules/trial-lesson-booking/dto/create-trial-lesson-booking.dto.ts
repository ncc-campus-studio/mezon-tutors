import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsUUID, Max, Min } from 'class-validator'

export class CreateTrialLessonBookingDto {
  @IsUUID()
  tutorId: string

  @IsDateString()
  startAt: string

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number

  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(60)
  durationMinutes: number
}
