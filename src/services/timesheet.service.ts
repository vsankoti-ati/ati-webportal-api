import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';
import { Timesheet } from '../entities/timesheet.entity';
import { CreateTimesheetDto, UpdateTimesheetDto } from '../dtos/timesheet.dto';
import { RequestUserService } from './request-user.service';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet)
    private timesheetRepository: Repository<Timesheet>,
    private readonly requestUserService: RequestUserService,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto): Promise<Timesheet> {
    // Check if a timesheet already exists for the given date range
    const existingTimesheet = await this.timesheetRepository.findOne({
      where: {
        employeeId: ILike(createTimesheetDto.employeeId),
        startDate: Between(createTimesheetDto.startDate, createTimesheetDto.endDate),
      },
    });

    if (existingTimesheet) {
      throw new BadRequestException('A timesheet already exists for this date range');
    }

    const timesheet = this.timesheetRepository.create({
      startDate: createTimesheetDto.startDate,
      endDate: createTimesheetDto.endDate,
      employeeId: createTimesheetDto.employeeId,
      status: 'draft',
    });
    
    return await this.timesheetRepository.save(timesheet);
  }

  async findAll(): Promise<Timesheet[]> {
    return await this.timesheetRepository.find({
      relations: ['employee', 'timeEntries', 'approvals'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByEmployee(employeeId: string): Promise<Timesheet[]> {
    return await this.timesheetRepository.find({
      where: { employeeId: ILike(employeeId) },
      relations: ['timeEntries', 'approvals'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Timesheet> {
    const timesheet = await this.timesheetRepository.findOne({
      where: { id },
      relations: ['employee', 'timeEntries', 'approvals'],
    });
    
    if (!timesheet) {
      throw new NotFoundException(`Timesheet with ID ${id} not found`);
    }
    
    return timesheet;
  }

  async update(id: number, updateTimesheetDto: UpdateTimesheetDto): Promise<Timesheet> {
    const timesheet = await this.findOne(id);
    
    if (updateTimesheetDto.status === 'submitted') {
      timesheet.submissionDate = new Date();
    } else if (updateTimesheetDto.status === 'approved') {
      timesheet.approvalDate = new Date();
      timesheet.approvedByEmployeeId = updateTimesheetDto.approvedByEmployeeId;
    }
    
    Object.assign(timesheet, updateTimesheetDto);
    return await this.timesheetRepository.save(timesheet);
  }

  async remove(id: number): Promise<void> {
    const timesheet = await this.findOne(id);
    if (timesheet.status !== 'draft') {
      throw new BadRequestException('Only draft timesheets can be deleted');
    }
    
    const result = await this.timesheetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Timesheet with ID ${id} not found`);
    }
  }

  async findPendingApprovals(approverId: string): Promise<Timesheet[]> {
    return await this.timesheetRepository.find({
      where: {
        status: 'submitted',
        approvals: {
          approverEmployeeId: approverId,
          approvalStatus: 'pending',
        },
      },
      relations: ['employee', 'timeEntries', 'approvals'],
      order: {
        submissionDate: 'ASC',
      },
    });
  }
}