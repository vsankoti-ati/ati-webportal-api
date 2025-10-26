import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from '../dtos/time-entry.dto';
import { TimesheetService } from './timesheet.service';

@Injectable()
export class TimeEntryService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,
    private timesheetService: TimesheetService,
  ) {}

  async create(timesheetId: number, createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
    const timesheet = await this.timesheetService.findOne(timesheetId);
    
    if (timesheet.status !== 'draft') {
      throw new BadRequestException('Can only add time entries to draft timesheets');
    }

    const timeEntry = this.timeEntryRepository.create({
      ...createTimeEntryDto,
      timesheetId: timesheetId,
    });
    
    return await this.timeEntryRepository.save(timeEntry);
  }

  async findByTimesheet(timesheetId: number): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: { timesheetId: timesheetId },
      relations: ['project'],
      order: {
        entryDate: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id },
      relations: ['project', 'timesheet'],
    });
    
    if (!timeEntry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }
    
    return timeEntry;
  }

  async update(id: number, updateTimeEntryDto: UpdateTimeEntryDto): Promise<TimeEntry> {
    const timeEntry = await this.findOne(id);
    
    if (timeEntry.timesheet.status !== 'draft') {
      throw new BadRequestException('Can only update time entries in draft timesheets');
    }
    
    Object.assign(timeEntry, updateTimeEntryDto);
    return await this.timeEntryRepository.save(timeEntry);
  }

  async remove(id: number): Promise<void> {
    const timeEntry = await this.findOne(id);
    
    if (timeEntry.timesheet.status !== 'draft') {
      throw new BadRequestException('Can only delete time entries from draft timesheets');
    }
    
    const result = await this.timeEntryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }
  }
}