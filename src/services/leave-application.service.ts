import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { LeaveApplication } from '../entities/leave-application.entity';
import { CreateLeaveApplicationDto, UpdateLeaveApplicationDto } from '../dtos/leave-application.dto';
import { LeaveService } from './leave.service';
import { LeaveType } from '../enums/leave-type.enum';

@Injectable()
export class LeaveApplicationService {
  constructor(
    @InjectRepository(LeaveApplication)
    private leaveApplicationRepository: Repository<LeaveApplication>,
    private leaveService: LeaveService,
  ) {}

  async create(createLeaveApplicationDto: CreateLeaveApplicationDto): Promise<LeaveApplication> {
    // Validate dates
    if (createLeaveApplicationDto.fromDate > createLeaveApplicationDto.toDate) {
      throw new BadRequestException('From date cannot be after to date');
    }

    // Check for overlapping leave applications
    const overlapping = await this.leaveApplicationRepository.findOne({
      where: [
        {
          employeeId: createLeaveApplicationDto.employeeId,
          status: 'APPROVED',
          fromDate: LessThanOrEqual(createLeaveApplicationDto.toDate),
          toDate: MoreThanOrEqual(createLeaveApplicationDto.fromDate),
        },
      ],
    });

    if (overlapping) {
      throw new BadRequestException('There is already an approved leave application for this period');
    }

    // Calculate number of days
    const days = Math.ceil(
      (createLeaveApplicationDto.toDate.getTime() - createLeaveApplicationDto.fromDate.getTime()) /
        (1000 * 60 * 60 * 24) + 1
    );

    // Check leave balance
    const leaves = await this.leaveService.findByEmployeeId(createLeaveApplicationDto.employeeId);
    const totalBalance = leaves.reduce((sum, leave) => sum + leave.leaveBalance, 0);

    if (days > totalBalance) {
      throw new BadRequestException('Insufficient leave balance');
    }

    const leaveApplication = this.leaveApplicationRepository.create({
      ...createLeaveApplicationDto,
      status: 'PENDING',
    });

    return await this.leaveApplicationRepository.save(leaveApplication);
  }

  async findAll(): Promise<LeaveApplication[]> {
    return await this.leaveApplicationRepository.find({
      relations: ['employee'],
      order: {
        appliedDate: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<LeaveApplication> {
    const application = await this.leaveApplicationRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!application) {
      throw new NotFoundException(`Leave application with ID ${id} not found`);
    }
    return application;
  }

  async findByEmployeeId(employeeId: string): Promise<LeaveApplication[]> {
    return await this.leaveApplicationRepository.find({
      where: { employeeId: employeeId },
      relations: ['employee'],
      order: {
        appliedDate: 'DESC',
      },
    });
  }

  async update(id: number, updateLeaveApplicationDto: UpdateLeaveApplicationDto): Promise<LeaveApplication> {
    const application = await this.findOne(id);
    
    if (application.status !== 'PENDING') {
      throw new BadRequestException('Only pending applications can be updated');
    }

    Object.assign(application, updateLeaveApplicationDto);
    
    if (updateLeaveApplicationDto.status === 'APPROVED') {
      // Update leave balance when approved
      const days = Math.ceil(
        (application.toDate.getTime() - application.fromDate.getTime()) /
          (1000 * 60 * 60 * 24) + 1
      );
      
      const leaves = await this.leaveService.findByEmployeeId(application.employeeId);
      const leave = leaves[0]; // Assuming one leave type for simplicity
      if (leave) {
        await this.leaveService.update(leave.id, {
          leaveBalance: leave.leaveBalance - days,
          leaveType: LeaveType.EARNED, // Assuming EARNED type for simplicity
        });
      }
    }

    return await this.leaveApplicationRepository.save(application);
  }

  async remove(id: number): Promise<void> {
    const result = await this.leaveApplicationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Leave application with ID ${id} not found`);
    }
  }
}