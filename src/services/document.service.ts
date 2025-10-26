import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto, DocumentResponseDto } from '../dtos/document.dto';
import { ResultWithData } from '../utils/result';
import { OneDriveService } from './onedrive.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly oneDriveService: OneDriveService,
  ) {}

  async create(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
    userId: number,
  ): Promise<ResultWithData<DocumentResponseDto>> {
    try {
      // Upload file to OneDrive
      const uploadResult = await this.oneDriveService.uploadFile(file);
      
      const document = this.documentRepository.create({
        ...createDocumentDto,
        uploadedBy: userId,
        uploadDt: new Date(),
        status: 'Active',
        file_path: uploadResult.webUrl,
      });

      const savedDocument = await this.documentRepository.save(document);

      return {
        success: true,
        data: this.mapToResponseDto(savedDocument),
        message: 'Document uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to upload document',
        error: error.message,
      };
    }
  }

  async findAll(userId: number, isAdmin: boolean): Promise<ResultWithData<DocumentResponseDto[]>> {
    try {
      const queryBuilder = this.documentRepository
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.employee', 'employee')
        .select([
          'document',
          'employee.firstName',
          'employee.lastName',
        ]);

      if (!isAdmin) {
        queryBuilder.where('document.uploadedBy = :userId', { userId });
      }

      const documents = await queryBuilder.getMany();

      return {
        success: true,
        data: documents.map(doc => this.mapToResponseDto(doc)),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch documents',
        error: error.message,
      };
    }
  }

  async findOne(id: number, userId: number, isAdmin: boolean): Promise<ResultWithData<DocumentResponseDto>> {
    try {
      const queryBuilder = this.documentRepository
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.employee', 'employee')
        .where('document.id = :id', { id });

      if (!isAdmin) {
        queryBuilder.andWhere('document.uploadedBy = :userId', { userId });
      }

      const document = await queryBuilder.getOne();

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      return {
        success: true,
        data: this.mapToResponseDto(document),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch document',
        error: error.message,
      };
    }
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<ResultWithData<DocumentResponseDto>> {
    try {
      const document = await this.documentRepository.findOne({
        where: { id },
        relations: ['employee'],
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      if (!isAdmin && document.uploadedBy !== userId) {
        throw new BadRequestException('You can only update your own documents');
      }

      const updatedDocument = await this.documentRepository.save({
        ...document,
        ...updateDocumentDto,
      });

      return {
        success: true,
        data: this.mapToResponseDto(updatedDocument),
        message: 'Document updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update document',
        error: error.message,
      };
    }
  }

  async remove(id: number, userId: number, isAdmin: boolean): Promise<ResultWithData<void>> {
    try {
      const document = await this.documentRepository.findOne({
        where: { id },
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      if (!isAdmin && document.uploadedBy !== userId) {
        throw new BadRequestException('You can only delete your own documents');
      }

      // Delete file from OneDrive
      await this.oneDriveService.deleteFile(document.file_path);

      await this.documentRepository.remove(document);

      return {
        success: true,
        message: 'Document deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete document',
        error: error.message,
      };
    }
  }

  private mapToResponseDto(document: Document): DocumentResponseDto {
    return {
      id: document.id,
      name: document.name,
      type: document.type,
      uploadedBy: document.uploadedBy,
      uploadDt: document.uploadDt,
      status: document.status,
      comments: document.comments,
      file_path: document.file_path,
      employeeName: document.employee 
        ? `${document.employee.firstName} ${document.employee.lastName}`
        : undefined,
    };
  }
}