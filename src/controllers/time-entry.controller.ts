import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TimeEntryService } from '../services/time-entry.service';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from '../dtos/time-entry.dto';
import { RolesGuard } from '../guards/roles.guard';

@Controller('time-entries')
@UseGuards(RolesGuard)
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Post(':timesheetId')
  create(
    @Param('timesheetId') timesheetId: string,
    @Body() createTimeEntryDto: CreateTimeEntryDto,
  ) {
    return this.timeEntryService.create(+timesheetId, createTimeEntryDto);
  }

  @Get('timesheet/:timesheetId')
  findByTimesheet(@Param('timesheetId') timesheetId: number) {
    return this.  timeEntryService.findByTimesheet(+timesheetId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.timeEntryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTimeEntryDto: UpdateTimeEntryDto) {
    return this.timeEntryService.update(id, updateTimeEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.timeEntryService.remove(id);
  }
}