import { IsArray, ValidateNested, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilitySlotDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class UpdateAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availability: AvailabilitySlotDto[];
}
