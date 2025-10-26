import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ description: 'The name of the document' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The type of document (e.g., Resume, Offer Letter, ID Proof)' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Additional comments about the document' })
  @IsString()
  @IsOptional()
  comments?: string;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'Updated name of the document' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Updated status of the document',
    enum: ['Active', 'Archived', 'Pending']
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Updated comments about the document' })
  @IsString()
  @IsOptional()
  comments?: string;
}

export class DocumentResponseDto {
  @ApiProperty({ description: 'The unique identifier of the document' })
  id: number;

  @ApiProperty({ description: 'The name of the document' })
  name: string;

  @ApiProperty({ description: 'The type of document' })
  type: string;

  @ApiProperty({ description: 'ID of the employee who uploaded the document' })
  uploadedBy: number;

  @ApiProperty({ description: 'Date and time when the document was uploaded' })
  uploadDt: Date;

  @ApiProperty({ 
    description: 'Current status of the document',
    enum: ['Active', 'Archived', 'Pending']
  })
  status: string;

  @ApiPropertyOptional({ description: 'Additional comments about the document' })
  comments?: string;

  @ApiProperty({ description: 'The file path or URL where the document is stored' })
  file_path: string;

  @ApiPropertyOptional({ description: 'Full name of the employee who uploaded the document' })
  employeeName?: string;
}