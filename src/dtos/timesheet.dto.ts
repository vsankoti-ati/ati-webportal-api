import {
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsInt,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimesheetStatus } from '../enums/timesheet-status.enum';
import { string } from 'joi';



export class CreateTimesheetDto {
  @ApiProperty({ description: 'Employee ID for the timesheet' })
  @Type(() => String)
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Start date of the timesheet period' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({ description: 'End date of the timesheet period' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}

export class UpdateTimesheetDto {
  @ApiProperty({ description: 'Timesheet status', enum: TimesheetStatus })
  @IsEnum(TimesheetStatus)
  @IsNotEmpty()
  status: TimesheetStatus;

  @ApiPropertyOptional({ description: 'ID of the employee who approved the timesheet' })
  @IsOptional()
  @IsInt()
  @Type(() => string)
  @ValidateIf((o) => o.status === TimesheetStatus.APPROVED)
  @IsNotEmpty({ message: 'Approver ID is required when status is approved' })
  approvedByEmployeeId?: string;
}

export class CreateTimeEntryDto {
  @ApiProperty({ description: 'Project ID for the time entry' })
  @IsInt()
  @Type(() => Number)
  projectId: number;

  @ApiProperty({ description: 'Date of the time entry' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  entryDate: Date;

  @ApiPropertyOptional({ description: 'Start time of work' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  startTime?: Date;

  @ApiPropertyOptional({ description: 'End time of work' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  endTime?: Date;

  @ApiProperty({ description: 'Number of hours worked', minimum: 0, maximum: 24 })
  @IsNumber()
  @Min(0)
  @Max(24)
  @Type(() => Number)
  hoursWorked: number;

  @ApiPropertyOptional({ description: 'Notes about the work done' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;
}

export class UpdateTimeEntryDto implements Partial<CreateTimeEntryDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  projectId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  @Type(() => Number)
  hoursWorked?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateApprovalDto {
  @ApiProperty({ description: 'Approval status', enum: TimesheetStatus })
  @IsEnum(TimesheetStatus)
  @IsNotEmpty()
  approvalStatus: TimesheetStatus;

  @ApiPropertyOptional({ description: 'Comments from the approver' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  comments?: string;
}