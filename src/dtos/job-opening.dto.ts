import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum EmploymentType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship',
}

export class CreateJobOpeningDto {
  @ApiProperty({ description: 'Job title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({ description: 'Job description' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @Transform(({ value }) => value?.trim())
  description: string;

  @ApiProperty({ description: 'Department name' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  department: string;

  @ApiProperty({ description: 'Job location' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  location: string;

  @ApiProperty({ description: 'Employment type', enum: EmploymentType })
  @IsEnum(EmploymentType)
  @IsNotEmpty()
  employmentType: string;

  @ApiProperty({ description: 'Experience required (e.g., "3-5 years")' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  experienceRequired: string;

  @ApiProperty({ description: 'Required skills', type: [String], example: ['JavaScript', 'TypeScript', 'React'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  skillsRequired: string[];

  @ApiProperty({ description: 'Job responsibilities', type: [String], example: ['Lead development team', 'Code review'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  responsibilities: string[];

  @ApiProperty({ description: 'Qualifications required', type: [String], example: ['Bachelor\'s Degree', '5+ years experience'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  qualifications: string[];

  @ApiPropertyOptional({ description: 'Salary range (e.g., "$80k-$120k")' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  salaryRange?: string;

  @ApiPropertyOptional({ description: 'Whether the job opening is active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean = true;
}

export class UpdateJobOpeningDto implements Partial<CreateJobOpeningDto> {
  @ApiPropertyOptional({ description: 'Job title' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiPropertyOptional({ description: 'Job description' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({ description: 'Department name' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  department?: string;

  @ApiPropertyOptional({ description: 'Job location' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  location?: string;

  @ApiPropertyOptional({ description: 'Employment type', enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: string;

  @ApiPropertyOptional({ description: 'Experience required' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  experienceRequired?: string;

  @ApiPropertyOptional({ description: 'Required skills', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillsRequired?: string[];

  @ApiPropertyOptional({ description: 'Job responsibilities', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @ApiPropertyOptional({ description: 'Qualifications required', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];

  @ApiPropertyOptional({ description: 'Salary range' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  salaryRange?: string;

  @ApiPropertyOptional({ description: 'Whether the job opening is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class JobOpeningResponseDto extends CreateJobOpeningDto {
  @ApiProperty({ description: 'Job opening unique identifier' })
  id: number;

  @ApiProperty({ description: 'Record creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updatedAt: Date;
}