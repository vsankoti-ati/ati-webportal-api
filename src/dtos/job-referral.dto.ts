import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateJobReferralDto {
  @IsNumber()
  @IsOptional()
  jobOpeningId?: number;

  @IsNumber()
  @IsNotEmpty()
  referredBy: number;

  @IsNumber()
  @IsNotEmpty()
  candidateId: number;

  @IsString()
  @IsNotEmpty()
  referralStatus: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateJobReferralDto extends CreateJobReferralDto {}