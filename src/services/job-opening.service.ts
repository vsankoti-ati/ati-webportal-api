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
    // Convert arrays to comma-separated strings for storage
    const jobData: Partial<JobOpening> = {
      ...createJobOpeningDto,
      skillsRequired: createJobOpeningDto.skillsRequired?.join(',') || '',
      responsibilities: createJobOpeningDto.responsibilities?.join(',') || '',
      qualifications: createJobOpeningDto.qualifications?.join(',') || '',
    };
    
    const jobOpening = this.jobOpeningRepository.create(jobData);
    const saved: JobOpening = await this.jobOpeningRepository.save(jobOpening);
    
    // Parse comma-separated strings back to arrays for response
    return this.parseJobOpeningArrays(saved);
  }

  async findAll(): Promise<JobOpening[]> {
    const jobOpenings = await this.jobOpeningRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    
    // Parse comma-separated strings for all job openings
    return jobOpenings.map(job => this.parseJobOpeningArrays(job));
  }

  async findOne(id: number): Promise<JobOpening> {
    const jobOpening = await this.jobOpeningRepository.findOneBy({ id });
    if (!jobOpening) {
      throw new NotFoundException(`Job opening with ID ${id} not found`);
    }
    return this.parseJobOpeningArrays(jobOpening);
  }

  async update(id: number, updateJobOpeningDto: UpdateJobOpeningDto): Promise<JobOpening> {
    const jobOpening = await this.findOne(id);
    
    // Convert arrays to comma-separated strings if provided
    const updateData: any = { ...updateJobOpeningDto };
    if (updateJobOpeningDto.skillsRequired !== undefined) {
      updateData.skillsRequired = updateJobOpeningDto.skillsRequired?.join(',') || '';
    }
    if (updateJobOpeningDto.responsibilities !== undefined) {
      updateData.responsibilities = updateJobOpeningDto.responsibilities?.join(',') || '';
    }
    if (updateJobOpeningDto.qualifications !== undefined) {
      updateData.qualifications = updateJobOpeningDto.qualifications?.join(',') || '';
    }
    
    Object.assign(jobOpening, updateData);
    const saved = await this.jobOpeningRepository.save(jobOpening);
    
    return this.parseJobOpeningArrays(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.jobOpeningRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job opening with ID ${id} not found`);
    }
  }

  /**
   * Helper method to parse comma-separated strings to arrays
   */
  private parseJobOpeningArrays(jobOpening: JobOpening): JobOpening {
    const parsed: any = { ...jobOpening };
    
    // Parse skillsRequired
    if (jobOpening.skillsRequired && typeof jobOpening.skillsRequired === 'string') {
      parsed.skillsRequired = jobOpening.skillsRequired
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    } else {
      parsed.skillsRequired = [];
    }
    
    // Parse responsibilities
    if (jobOpening.responsibilities && typeof jobOpening.responsibilities === 'string') {
      parsed.responsibilities = jobOpening.responsibilities
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    } else {
      parsed.responsibilities = [];
    }
    
    // Parse qualifications
    if (jobOpening.qualifications && typeof jobOpening.qualifications === 'string') {
      parsed.qualifications = jobOpening.qualifications
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    } else {
      parsed.qualifications = [];
    }
    
    return parsed;
  }
}