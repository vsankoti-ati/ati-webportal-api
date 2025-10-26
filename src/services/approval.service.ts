import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from '../entities/approval.entity';
import { CreateApprovalDto, UpdateApprovalDto } from '../dtos/approval.dto';
import { TimesheetService } from './timesheet.service';
import { TimesheetStatus } from '../enums/timesheet-status.enum';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(Approval)
    private approvalRepository: Repository<Approval>,
    private timesheetService: TimesheetService,
  ) {}

  async create(timesheetId: number, approverId: number, createApprovalDto: CreateApprovalDto): Promise<Approval> {
    const timesheet = await this.timesheetService.findOne(timesheetId);

    // Check if the approver has already submitted an approval
    const existingApproval = await this.approvalRepository.findOne({
      where: {
        timesheetId: timesheetId,
        approverEmployeeId: approverId,
      },
    });

    if (existingApproval) {
      Object.assign(existingApproval, createApprovalDto);
      existingApproval.approvedDate = new Date();
      return await this.approvalRepository.save(existingApproval);
    }

    const approval = this.approvalRepository.create({
      ...createApprovalDto,
      timesheetId: timesheetId,
      approverEmployeeId: approverId,
      approvedDate: new Date(),
    });
    
    const savedApproval = await this.approvalRepository.save(approval);

    // Update timesheet status if needed
    if (createApprovalDto.approvalStatus !== 'pending') {
      await this.timesheetService.update(timesheetId, {
        status: createApprovalDto.approvalStatus === 'approved' ? TimesheetStatus.APPROVED : TimesheetStatus.REJECTED as TimesheetStatus,
        approvedByEmployeeId: approverId,
      });
    }


    return savedApproval;
  }

  async findByTimesheet(timesheetId: number): Promise<Approval[]> {
    return await this.approvalRepository.find({
      where: { timesheetId: timesheetId },
      relations: ['approver'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByApprover(approverId: number): Promise<Approval[]> {
    return await this.approvalRepository.find({
      where: { approverEmployeeId: approverId },
      relations: ['timesheet', 'timesheet.employee'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Approval> {
    const approval = await this.approvalRepository.findOne({
      where: { id },
      relations: ['timesheet', 'approver'],
    });
    
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }
    
    return approval;
  }

  async update(id: number, updateApprovalDto: UpdateApprovalDto): Promise<Approval> {
    const approval = await this.findOne(id);
    Object.assign(approval, updateApprovalDto);
    approval.approvedDate = new Date();
    
    const savedApproval = await this.approvalRepository.save(approval);

    // Update timesheet status if needed
    if (updateApprovalDto.approvalStatus !== 'pending') {
      await this.timesheetService.update(approval.timesheetId, {
        status: updateApprovalDto.approvalStatus === 'approved' ? TimesheetStatus.APPROVED : TimesheetStatus.REJECTED as TimesheetStatus,
        approvedByEmployeeId: approval.approverEmployeeId,
      });
    }

    return savedApproval;
  }
}