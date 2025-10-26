import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from '../entities/leave.entity';
import { CreateLeaveDto, UpdateLeaveDto } from '../dtos/leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
  ) {}

  async create(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    const leave = this.leaveRepository.create(createLeaveDto);
    return await this.leaveRepository.save(leave);
  }

  async findAll(): Promise<Leave[]> {
    return await this.leaveRepository.find({
      relations: ['employee'],
    });
  }

  async findOne(id: number): Promise<Leave> {
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
    return leave;
  }

  async findByEmployeeId(employeeId: number): Promise<Leave[]> {
    return await this.leaveRepository.find({
      where: { employeeId: employeeId },
      relations: ['employee'],
    });
  }

  async update(id: number, updateLeaveDto: UpdateLeaveDto): Promise<Leave> {
    const leave = await this.findOne(id);
    Object.assign(leave, updateLeaveDto);
    return await this.leaveRepository.save(leave);
  }

  async remove(id: number): Promise<void> {
    const result = await this.leaveRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
  }
}