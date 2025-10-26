import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobReferral } from '../entities/job-referral.entity';
import { CreateJobReferralDto, UpdateJobReferralDto } from '../dtos/job-referral.dto';

@Injectable()
export class JobReferralService {
  constructor(
    @InjectRepository(JobReferral)
    private jobReferralRepository: Repository<JobReferral>,
  ) {}

  async create(createJobReferralDto: CreateJobReferralDto): Promise<JobReferral> {
    const jobReferral = this.jobReferralRepository.create({
      ...createJobReferralDto,
      referralStatus: 'PENDING',
    });
    return await this.jobReferralRepository.save(jobReferral);
  }

  async findAll(): Promise<JobReferral[]> {
    return await this.jobReferralRepository.find({
      relations: ['jobOpening', 'referrer', 'candidate', 'candidate.address'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByReferrer(referrerId: number): Promise<JobReferral[]> {
    return await this.jobReferralRepository.find({
      where: { referredBy: referrerId },
      relations: ['jobOpening', 'referrer', 'candidate', 'candidate.address'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<JobReferral> {
    const jobReferral = await this.jobReferralRepository.findOne({
      where: { id },
      relations: ['jobOpening', 'referrer', 'candidate', 'candidate.address'],
    });
    if (!jobReferral) {
      throw new NotFoundException(`Job referral with ID ${id} not found`);
    }
    return jobReferral;
  }

  async update(id: number, updateJobReferralDto: UpdateJobReferralDto): Promise<JobReferral> {
    const jobReferral = await this.findOne(id);
    Object.assign(jobReferral, updateJobReferralDto);
    return await this.jobReferralRepository.save(jobReferral);
  }

  async remove(id: number): Promise<void> {
    const result = await this.jobReferralRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job referral with ID ${id} not found`);
    }
  }
}