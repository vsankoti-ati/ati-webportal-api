import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from 'src/auth/public.decorator';
import { UUID } from 'crypto';

@Controller('employees')
@Public()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Roles('Admin', 'HR')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  //@Roles('Admin', 'HR')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('email/:email')
  //@Roles('Employee', 'Admin', 'HR')
  async getProfileByEmail(@Param('email') email: string) {
    return this.employeeService.findByEmail(email);
  }

  @Get(':id')
  //@Roles('Admin', 'HR')
  findOne(@Param('id') id: UUID) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: UUID, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  //@Roles('Admin', 'HR')
  remove(@Param('id') id: UUID) {
    return this.employeeService.remove(id);
  }
}