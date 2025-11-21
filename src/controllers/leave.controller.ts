import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeaveService } from '../services/leave.service';
import { CreateLeaveDto, UpdateLeaveDto } from '../dtos/leave.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('leaves')
@UseGuards(RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @Roles('ati_portal_admin')
  create(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  @Roles('ati_portal_admin')
  findAll() {
    return this.leaveService.findAll();
  }

  @Get(':id')
  @Roles('ati_portal_admin')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Get('employee/:id')
  @Roles('ati_portal_admin')
  findByEmployee(@Param('id') id: string) {
    return this.leaveService.findByEmployeeId(id);
  }

  @Patch(':id')
  @Roles('ati_portal_admin')
  update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leaveService.update(+id, updateLeaveDto);
  }

  @Delete(':id')
  @Roles('ati_portal_admin')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}