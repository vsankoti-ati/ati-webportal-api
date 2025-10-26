import { IsNotEmpty, IsNumber, IsDate, IsString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTimeEntryDto {
  @IsNumber()
  @IsNotEmpty()
  project_id: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  entry_date: Date;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(24)
  hours_worked: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTimeEntryDto extends CreateTimeEntryDto {}