import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CandidateService } from '../services/candidate.service';
import { CreateCandidateDto, UpdateCandidateDto } from '../dtos/candidate.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('candidates')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  @Roles('Admin', 'HR')
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidateService.create(createCandidateDto);
  }

  @Get()
  @Roles('Admin', 'HR')
  findAll() {
    return this.candidateService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'HR')
  findOne(@Param('id') id: string) {
    return this.candidateService.findOne(+id);
  }

  @Get('job/:jobId')
  @Roles('Admin', 'HR')
  findByJobOpening(@Param('jobId') jobId: string) {
    return this.candidateService.findByJobOpening(+jobId);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateCandidateDto: UpdateCandidateDto) {
    return this.candidateService.update(+id, updateCandidateDto);
  }

  @Delete(':id')
  @Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.candidateService.remove(+id);
  }
}