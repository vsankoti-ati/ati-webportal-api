import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum EmployeeRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
  HR = 'HR',
}

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

  @ApiProperty({ description: 'Employee role', enum: EmployeeRole })
  @IsEnum(EmployeeRole)
  @IsNotEmpty()
  role: EmployeeRole;

  @ApiProperty({ description: 'Employee email address' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  emailId: string;

  @ApiProperty({ description: 'First line of the address' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  addressLine1: string;

  @ApiPropertyOptional({ description: 'Second line of the address' })
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

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?1?\d{9,15}$/, {
    message: 'Phone number must be valid (e.g., +1234567890)',
  })
  phoneNumber: string;

  @ApiProperty({ description: 'Employee hire date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  hireDate: Date;

  @ApiPropertyOptional({ description: 'Whether the employee is active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Additional comments' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  comment?: string;
}

export class UpdateEmployeeDto implements Partial<CreateEmployeeDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ enum: EmployeeRole })
  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  emailId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // Add other fields as optional...
}

export class EmployeeResponseDto extends CreateEmployeeDto {
  @ApiProperty({ description: 'Employee unique identifier' })
  id: number;

  @ApiProperty({ description: 'Record creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updatedAt: Date;
}