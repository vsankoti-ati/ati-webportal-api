import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from '../services/document.service';
import { CreateDocumentDto, UpdateDocumentDto, DocumentResponseDto } from '../dtos/document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { diskStorage } from 'multer';
import * as path from 'path';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload',
        },
        name: {
          type: 'string',
          description: 'Name of the document',
        },
        type: {
          type: 'string',
          description: 'Type of the document',
        },
        comments: {
          type: 'string',
          description: 'Optional comments about the document',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully uploaded',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req,
  ) {
    return this.documentService.create(file, createDocumentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({
    status: 200,
    description: 'Returns all documents the user has access to',
    type: [DocumentResponseDto],
  })
  async findAll(@Request() req) {
    const isAdmin = req.user.roles.includes('Admin');
    return this.documentService.findAll(req.user.id, isAdmin);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the document',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.roles.includes('Admin');
    return this.documentService.findOne(+id, req.user.id, isAdmin);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'The document has been successfully updated',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Request() req,
  ) {
    const isAdmin = req.user.roles.includes('Admin');
    return this.documentService.update(+id, updateDocumentDto, req.user.id, isAdmin);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 204, description: 'The document has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.roles.includes('Admin');
    return this.documentService.remove(+id, req.user.id, isAdmin);
  }
}