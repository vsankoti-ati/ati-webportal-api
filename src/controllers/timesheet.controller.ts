import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TimesheetService } from '../services/timesheet.service';
import { CreateTimesheetDto, UpdateTimesheetDto } from '../dtos/timesheet.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RequestUserService } from 'src/services/request-user.service';

@Controller('timesheets')
@UseGuards(RolesGuard)
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService, 
    private readonly requestUserService: RequestUserService) {}

  @Post()
  create(@Body() createTimesheetDto: CreateTimesheetDto) {    
    return this.timesheetService.create(createTimesheetDto);
  }

  @Get()
  @Roles('ati-portal-user', 'ati_portal_admin')
  findAll() {
    return this.timesheetService.findAll();
  }

  @Get('my-timesheets')
  //@Roles('ati-portal-user', 'ati_portal_admin')
  findMyTimesheets(@Query('employeeId') employeeId: string) {
    // if (!employeeId) {
    //   const user = this.requestUserService.getUser();
    //   employeeId = user.id;
    // }
    return this.timesheetService.findByEmployee(employeeId);
  }

  @Get('pending-approvals')
  @Roles('ati_portal_admin')
  findPendingApprovals(@Request() req) {
    return this.timesheetService.findPendingApprovals(req.user.employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timesheetService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ati_portal_admin')
  update(@Param('id') id: string, @Body() updateTimesheetDto: UpdateTimesheetDto, @Request() req) {
    return this.timesheetService.update(+id, {
      ...updateTimesheetDto,
      approvedByEmployeeId: updateTimesheetDto.status === 'approved' ? req.user.employeeId : undefined,
    });
  }

  @Delete(':id')
 @Roles('ati_portal_admin')
  remove(@Param('id') id: string) {
    return this.timesheetService.remove(+id);
  }
}