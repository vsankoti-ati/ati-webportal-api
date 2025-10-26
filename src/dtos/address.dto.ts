import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'Type of address (e.g., Home, Work)' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  type?: string;

  @ApiPropertyOptional({ description: 'Email address associated with this address' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  emailId?: string;

  @ApiPropertyOptional({ description: 'First line of the address' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  addressLine1?: string;

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
    message: 'zipcode must be in format: 12345 or 12345-6789',
  })
  zipcode: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?1?\d{9,15}$/, {
    message: 'Phone number must be valid (e.g., +1234567890)',
  })
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'Additional comments' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  comments?: string;
}

export class UpdateAddressDto extends CreateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  emailId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  addressLine1?: string;
}