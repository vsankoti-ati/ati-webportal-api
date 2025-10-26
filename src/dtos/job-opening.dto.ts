import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateJobOpeningDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  requirement: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @IsNumber()
  @IsNotEmpty()
  updatedBy: number;
}

export class UpdateJobOpeningDto extends CreateJobOpeningDto {}