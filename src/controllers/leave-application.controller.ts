import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeaveApplicationService } from '../services/leave-application.service';
import { CreateLeaveApplicationDto, UpdateLeaveApplicationDto } from '../dtos/leave-application.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('leave-applications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  @Post()
  @Roles('Employee', 'Admin', 'HR')
  create(@Body() createLeaveApplicationDto: CreateLeaveApplicationDto, @Request() req) {
    // If employee role, ensure they can only apply for themselves
    if (req.user.roles.includes('Employee') && !req.user.roles.includes('Admin') && !req.user.roles.includes('HR')) {
      if (createLeaveApplicationDto.employeeId !== req.user.employeeId) {
        throw new Error('Employees can only apply for their own leave');
      }
    }
    return this.leaveApplicationService.create(createLeaveApplicationDto);
  }

  @Get()
  @Roles('Admin', 'HR')
  findAll() {
    return this.leaveApplicationService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'HR', 'Employee')
  findOne(@Param('id') id: string) {
    return this.leaveApplicationService.findOne(+id);
  }

  @Get('employee/:id')
  @Roles('Admin', 'HR', 'Employee')
  async findByEmployee(@Param('id') id: string, @Request() req) {
    // If employee role, ensure they can only view their own applications
    if (req.user.roles.includes('Employee') && !req.user.roles.includes('Admin') && !req.user.roles.includes('HR')) {
      if (+id !== req.user.employeeId) {
        throw new Error('Employees can only view their own leave applications');
      }
    }
    return this.leaveApplicationService.findByEmployeeId(+id);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateLeaveApplicationDto: UpdateLeaveApplicationDto) {
    return this.leaveApplicationService.update(+id, updateLeaveApplicationDto);
  }

  @Delete(':id')
  @Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.leaveApplicationService.remove(+id);
  }
}