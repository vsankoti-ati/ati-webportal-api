import { IsString, IsNotEmpty, IsDate, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  end_date: Date;

  @IsEnum(['active', 'completed', 'on_hold', 'cancelled'])
  @IsOptional()
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
}

export class UpdateProjectDto extends CreateProjectDto {
  @IsEnum(['active', 'completed', 'on_hold', 'cancelled'])
  @IsNotEmpty()
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
}