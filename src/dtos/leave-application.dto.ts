import { IsNumber, IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaveApplicationDto {

  @IsNotEmpty()
  employeeId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  fromDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  toDate: Date;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateLeaveApplicationDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  comment?: string;
}