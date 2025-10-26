import { IsInt, IsString, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsDateString()
  @IsNotEmpty()
  dateOfHoliday: string;

  @IsString()
  @IsNotEmpty()
  holidayReason: string;

  @IsString()
  @IsNotEmpty()
  holidayType: string;
}

export class UpdateHolidayDto {
  @IsInt()
  @IsOptional()
  year?: number;

  @IsInt()
  @IsOptional()
  clientId?: number;

  @IsDateString()
  @IsOptional()
  dateOfHoliday?: string;

  @IsString()
  @IsOptional()
  holidayReason?: string;

  @IsString()
  @IsOptional()
  holidayType?: string;
}
