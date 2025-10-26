import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateApprovalDto {
  @IsEnum(['pending', 'approved', 'rejected'])
  @IsNotEmpty()
  approvalStatus: 'pending' | 'approved' | 'rejected';

  @IsString()
  @IsOptional()
  comments?: string;
}

export class UpdateApprovalDto extends CreateApprovalDto {}