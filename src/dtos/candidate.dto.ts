import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  addressId: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateCandidateDto extends CreateCandidateDto {}