import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsArray,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { string } from 'joi';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Employee first name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({ description: 'Employee last name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({ description: 'Employee email address' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?1?\d{9,15}$/, {
    message: 'Phone number must be valid (e.g., +1234567890)',
  })
  phone: string;

  @ApiProperty({ description: 'Department name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  department: string;

  @ApiProperty({ description: 'Job position/title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  position: string;

  @ApiPropertyOptional({ description: 'Manager name or ID' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  manager?: string;

  @ApiProperty({ description: 'Employee hire date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  hireDate: Date;

  @ApiProperty({ description: 'Unique employee ID' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  employeeId: string;

  @ApiProperty({ description: 'Primary address line' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  address: string;

  @ApiPropertyOptional({ description: 'Secondary address line' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  addressLine2?: string;

  @ApiProperty({ description: 'City name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  city: string;

  @ApiProperty({ description: 'State name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  state: string;

  @ApiProperty({ description: 'ZIP/Postal code' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'zip_code must be in format: 12345 or 12345-6789',
  })
  zipCode: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  emergencyContact?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?1?\d{9,15}$/, {
    message: 'Emergency phone must be valid (e.g., +1234567890)',
  })
  emergencyPhone?: string;

  @ApiPropertyOptional({ description: 'Employee skills', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'Additional comments' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  comment?: string;

  @ApiPropertyOptional({ description: 'App roles to assign to employee', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  appRoles?: string[];
}
export class UpdateEmployeeDto implements Partial<CreateEmployeeDto> {
  @ApiPropertyOptional({ description: 'Employee first name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @ApiPropertyOptional({ description: 'Employee last name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @ApiPropertyOptional({ description: 'Employee email address' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Department name' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Job position/title' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: 'Manager name or ID' })
  @IsOptional()
  @IsString()
  manager?: string;

  @ApiPropertyOptional({ description: 'Employee hire date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hireDate?: Date;

  @ApiPropertyOptional({ description: 'Unique employee ID' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Primary address line' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Secondary address line' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City name' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State name' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP/Postal code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  @ApiPropertyOptional({ description: 'Employee skills', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'Additional comments' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ description: 'Role IDs to assign to employee', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  roleIds?: number[];
}

export class EmployeeResponseDto extends CreateEmployeeDto {
  @ApiProperty({ description: 'Employee unique identifier (UUID)' })
  id: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Employee roles', type: 'array', items: { type: 'object' } })
  roles?: Array<{ id: number; name: string; description?: string }>;
}