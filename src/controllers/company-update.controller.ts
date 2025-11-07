import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyUpdateService } from '../services/company-update.service';
import { CreateCompanyUpdateDto, UpdateCompanyUpdateDto } from '../dtos/company-update.dto';
import { RolesGuard } from '../guards/roles.guard';

@Controller('company-updates')
@UseGuards(RolesGuard)
export class CompanyUpdateController {
  constructor(private readonly companyUpdateService: CompanyUpdateService) {}

  @Post()
  create(@Body() createCompanyUpdateDto: CreateCompanyUpdateDto) {
    return this.companyUpdateService.create(createCompanyUpdateDto);
  }

  @Get()
  findAll() {
    return this.companyUpdateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyUpdateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyUpdateDto: UpdateCompanyUpdateDto) {
    return this.companyUpdateService.update(+id, updateCompanyUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyUpdateService.remove(+id);
  }
}