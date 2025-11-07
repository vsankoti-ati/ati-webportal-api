import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobOpeningService } from '../services/job-opening.service';
import { CreateJobOpeningDto, UpdateJobOpeningDto, JobOpeningResponseDto } from '../dtos/job-opening.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../auth/public.decorator';

@ApiTags('job-openings')
@Controller('job-openings')
@Public()
export class JobOpeningController {
  constructor(private readonly jobOpeningService: JobOpeningService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job opening' })
  @ApiResponse({ status: 201, description: 'Job opening created successfully', type: JobOpeningResponseDto })
  //@Roles('Admin', 'HR')
  create(@Body() createJobOpeningDto: CreateJobOpeningDto) {
    return this.jobOpeningService.create(createJobOpeningDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job openings' })
  @ApiResponse({ status: 200, description: 'List of job openings', type: [JobOpeningResponseDto] })
  findAll() {
    return this.jobOpeningService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job opening by ID' })
  @ApiResponse({ status: 200, description: 'Job opening found', type: JobOpeningResponseDto })
  @ApiResponse({ status: 404, description: 'Job opening not found' })
  findOne(@Param('id') id: string) {
    return this.jobOpeningService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job opening' })
  @ApiResponse({ status: 200, description: 'Job opening updated successfully', type: JobOpeningResponseDto })
  @ApiResponse({ status: 404, description: 'Job opening not found' })
  //@Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateJobOpeningDto: UpdateJobOpeningDto) {
    return this.jobOpeningService.update(+id, updateJobOpeningDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job opening' })
  @ApiResponse({ status: 200, description: 'Job opening deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job opening not found' })
  //@Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.jobOpeningService.remove(+id);
  }
}