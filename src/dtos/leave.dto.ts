import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsEnum,
  Min,
  IsPositive,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { string } from 'joi';

enum LeaveType {
  EARNED = 'EARNED',
  HOLIDAY = 'HOLIDAY',
  UNPAID = 'UNPAID',
}

export class CreateLeaveDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsInt()
  @IsNotEmpty()
  @Type(() => String)
  employeeId: string;

  @ApiProperty({ description: 'Type of leave', enum: LeaveType })
  @IsEnum(LeaveType)
  @IsNotEmpty()
  leaveType: LeaveType;

  @ApiProperty({ description: 'Available leave balance in days', minimum: 0 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  leaveBalance: number;
}

export class UpdateLeaveDto implements Partial<CreateLeaveDto> {
  @ApiPropertyOptional({ description: 'Type of leave', enum: LeaveType })
  @IsOptional()
  @IsEnum(LeaveType)
  leaveType?: LeaveType;

  @ApiPropertyOptional({ description: 'Updated leave balance in days', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  leaveBalance?: number;
}

export class LeaveResponseDto extends CreateLeaveDto {
  @ApiProperty({ description: 'Leave record unique identifier' })
  id: number;

  @ApiProperty({ description: 'Record creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updatedAt: Date;
}

export class CreateLeaveApplicationDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  employeeId: string;

  @ApiProperty({ description: 'Leave start date' })
  @IsNotEmpty()
  @Type(() => Date)
  fromDate: Date;

  @ApiProperty({ description: 'Leave end date' })
  @IsNotEmpty()
  @Type(() => Date)
  toDate: Date;

  @ApiPropertyOptional({ description: 'Additional comments or reason for leave' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateLeaveApplicationDto {
  @ApiPropertyOptional({ description: 'Updated leave status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Comments from approver' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class LeaveApplicationResponseDto extends CreateLeaveApplicationDto {
  @ApiProperty({ description: 'Leave application unique identifier' })
  id: number;

  @ApiProperty({ description: 'Application status' })
  status: string;

  @ApiProperty({ description: 'Application submission date' })
  appliedDate: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updatedAt: Date;
}