import { IsNotEmpty, IsNumber, IsDate, IsString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTimeEntryDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  // @Type(() => Date)
  // @IsDate()
  @IsNotEmpty()
  entryDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(24)
  hoursWorked: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTimeEntryDto extends CreateTimeEntryDto {}