import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApprovalService } from '../services/approval.service';
import { CreateApprovalDto, UpdateApprovalDto } from '../dtos/approval.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('approvals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post(':timesheetId')
  @Roles('Admin')
  create(
    @Param('timesheetId') timesheetId: string,
    @Body() createApprovalDto: CreateApprovalDto,
    @Request() req,
  ) {
    return this.approvalService.create(+timesheetId, req.user.employeeId, createApprovalDto);
  }

  @Get('timesheet/:timesheetId')
  findByTimesheet(@Param('timesheetId') timesheetId: string) {
    return this.approvalService.findByTimesheet(+timesheetId);
  }

  @Get('my-approvals')
  @Roles('Admin')
  findMyApprovals(@Request() req) {
    return this.approvalService.findByApprover(req.user.employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.approvalService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() updateApprovalDto: UpdateApprovalDto) {
    return this.approvalService.update(+id, updateApprovalDto);
  }
}