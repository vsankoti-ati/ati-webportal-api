import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

enum JobStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ON_HOLD = 'On Hold',
}

enum ReferralStatus {
  PENDING = 'Pending',
  SCREENING = 'Screening',
  INTERVIEWING = 'Interviewing',
  REJECTED = 'Rejected',
  HIRED = 'Hired',
}

export class CreateJobOpeningDto {
  @ApiProperty({ description: 'Job title/name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ description: 'Job role/position' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  role: string;

  @ApiProperty({ description: 'Detailed job description' })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(2000)
  jobDescription: string;

  @ApiProperty({ description: 'Job requirements' })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(1000)
  requirement: string;

  @ApiPropertyOptional({ description: 'Additional comments' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;

  @ApiProperty({ description: 'ID of the employee who created the job opening' })
  @IsInt()
  @Type(() => Number)
  createdBy: number;

  @ApiProperty({ description: 'ID of the employee who last updated the job opening' })
  @IsInt()
  @Type(() => Number)
  updatedBy: number;
}

export class UpdateJobOpeningDto implements Partial<CreateJobOpeningDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  role?: string;

  @ApiPropertyOptional({ enum: JobStatus })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class CreateJobReferralDto {
  @ApiProperty({ description: 'Job opening ID' })
  @IsInt()
  @Type(() => Number)
  jobOpeningId: number;

  @ApiProperty({ description: 'Employee ID who made the referral' })
  @IsInt()
  @Type(() => Number)
  referredBy: number;

  @ApiProperty({ description: 'Candidate ID being referred' })
  @IsInt()
  @Type(() => Number)
  candidateId: number;

  @ApiPropertyOptional({ description: 'Additional comments about the referral' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class UpdateJobReferralDto {
  @ApiPropertyOptional({ enum: ReferralStatus })
  @IsOptional()
  @IsEnum(ReferralStatus)
  referralStatus?: ReferralStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class CreateCandidateDto {
  @ApiProperty({ description: 'Candidate full name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ description: 'Address ID for the candidate' })
  @IsInt()
  @Type(() => Number)
  addressId: number;

  @ApiPropertyOptional({ description: 'Current status of the candidate' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({ description: 'Additional comments about the candidate' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class UpdateCandidateDto implements Partial<CreateCandidateDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}