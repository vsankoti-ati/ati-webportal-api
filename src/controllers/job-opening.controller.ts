import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobOpeningService } from '../services/job-opening.service';
import { CreateJobOpeningDto, UpdateJobOpeningDto } from '../dtos/job-opening.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('job-openings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class JobOpeningController {
  constructor(private readonly jobOpeningService: JobOpeningService) {}

  @Post()
  @Roles('Admin', 'HR')
  create(@Body() createJobOpeningDto: CreateJobOpeningDto) {
    return this.jobOpeningService.create(createJobOpeningDto);
  }

  @Get()
  findAll() {
    return this.jobOpeningService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOpeningService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateJobOpeningDto: UpdateJobOpeningDto) {
    return this.jobOpeningService.update(+id, updateJobOpeningDto);
  }

  @Delete(':id')
  @Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.jobOpeningService.remove(+id);
  }
}