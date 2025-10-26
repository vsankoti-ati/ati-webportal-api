import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@Controller('employees')
@Public()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  //@Roles('Admin', 'HR')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  //@Roles('Admin', 'HR')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('profile')
  @Roles('Employee', 'Admin', 'HR')
  async getProfile(@Request() req) {
    return this.employeeService.findByEmail(req.user.email);
  }

  @Get(':id')
  @Roles('Admin', 'HR')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}