import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TimesheetService } from '../services/timesheet.service';
import { CreateTimesheetDto, UpdateTimesheetDto } from '../dtos/timesheet.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('timesheets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Post()
  create(@Request() req, @Body() createTimesheetDto: CreateTimesheetDto) {
    return this.timesheetService.create(req.user.employeeId, createTimesheetDto);
  }

  @Get()
  @Roles('Admin', 'HR')
  findAll() {
    return this.timesheetService.findAll();
  }

  @Get('my-timesheets')
  findMyTimesheets(@Request() req) {
    return this.timesheetService.findByEmployee(req.user.employeeId);
  }

  @Get('pending-approvals')
  @Roles('Admin')
  findPendingApprovals(@Request() req) {
    return this.timesheetService.findPendingApprovals(req.user.employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timesheetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimesheetDto: UpdateTimesheetDto, @Request() req) {
    return this.timesheetService.update(+id, {
      ...updateTimesheetDto,
      approvedByEmployeeId: updateTimesheetDto.status === 'approved' ? req.user.employeeId : undefined,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timesheetService.remove(+id);
  }
}