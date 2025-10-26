import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class CreateCompanyUpdateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsDate()
  eventDate?: Date;
}

export class UpdateCompanyUpdateDto extends CreateCompanyUpdateDto {}