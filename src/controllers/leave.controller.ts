import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeaveService } from '../services/leave.service';
import { CreateLeaveDto, UpdateLeaveDto } from '../dtos/leave.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('leaves')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @Roles('Admin', 'HR')
  create(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  @Roles('Admin', 'HR')
  findAll() {
    return this.leaveService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'HR', 'Employee')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Get('employee/:id')
  @Roles('Admin', 'HR', 'Employee')
  findByEmployee(@Param('id') id: string) {
    return this.leaveService.findByEmployeeId(+id);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leaveService.update(+id, updateLeaveDto);
  }

  @Delete(':id')
  @Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}