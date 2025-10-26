import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../entities/candidate.entity';
import { CreateCandidateDto, UpdateCandidateDto } from '../dtos/candidate.dto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = this.candidateRepository.create(createCandidateDto);
    return await this.candidateRepository.save(candidate);
  }

  async findAll(): Promise<Candidate[]> {
    return await this.candidateRepository.find({
      relations: ['jobOpening', 'referral', 'address'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByJobOpening(jobOpeningId: number): Promise<Candidate[]> {
    return await this.candidateRepository.find({
      where: { jobOpening: { id: jobOpeningId } },
      relations: ['jobOpening', 'referral', 'address'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { id },
      relations: ['address'],
    });
    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }
    return candidate;
  }

  async update(id: number, updateCandidateDto: UpdateCandidateDto): Promise<Candidate> {
    const candidate = await this.findOne(id);
    Object.assign(candidate, updateCandidateDto);
    return await this.candidateRepository.save(candidate);
  }

  async remove(id: number): Promise<void> {
    const result = await this.candidateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }
  }
}