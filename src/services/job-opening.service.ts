import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOpening } from '../entities/job-opening.entity';
import { CreateJobOpeningDto, UpdateJobOpeningDto } from '../dtos/job-opening.dto';

@Injectable()
export class JobOpeningService {
  constructor(
    @InjectRepository(JobOpening)
    private jobOpeningRepository: Repository<JobOpening>,
  ) {}

  async create(createJobOpeningDto: CreateJobOpeningDto): Promise<JobOpening> {
    const jobOpening = this.jobOpeningRepository.create(createJobOpeningDto);
    return await this.jobOpeningRepository.save(jobOpening);
  }

  async findAll(): Promise<JobOpening[]> {
    return await this.jobOpeningRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<JobOpening> {
    const jobOpening = await this.jobOpeningRepository.findOneBy({ id });
    if (!jobOpening) {
      throw new NotFoundException(`Job opening with ID ${id} not found`);
    }
    return jobOpening;
  }

  async update(id: number, updateJobOpeningDto: UpdateJobOpeningDto): Promise<JobOpening> {
    const jobOpening = await this.findOne(id);
    Object.assign(jobOpening, updateJobOpeningDto);
    return await this.jobOpeningRepository.save(jobOpening);
  }

  async remove(id: number): Promise<void> {
    const result = await this.jobOpeningRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job opening with ID ${id} not found`);
    }
  }
}