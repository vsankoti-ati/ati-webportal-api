import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobReferralService } from '../services/job-referral.service';
import { CreateJobReferralDto, UpdateJobReferralDto } from '../dtos/job-referral.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('job-referrals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class JobReferralController {
  constructor(private readonly jobReferralService: JobReferralService) {}

  @Post()
  create(@Body() createJobReferralDto: CreateJobReferralDto, @Request() req) {
    // Set the referredBy field to the current user's employee ID
    createJobReferralDto.referredBy = req.user.employeeId;
    return this.jobReferralService.create(createJobReferralDto);
  }

  @Get()
  @Roles('Admin', 'HR')
  findAll() {
    return this.jobReferralService.findAll();
  }

  @Get('my-referrals')
  findMyReferrals(@Request() req) {
    return this.jobReferralService.findByReferrer(req.user.employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobReferralService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateJobReferralDto: UpdateJobReferralDto) {
    return this.jobReferralService.update(+id, updateJobReferralDto);
  }

  @Delete(':id')
  @Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.jobReferralService.remove(+id);
  }
}