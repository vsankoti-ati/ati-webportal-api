import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyUpdate } from '../entities/company-update.entity';
import { CreateCompanyUpdateDto, UpdateCompanyUpdateDto } from '../dtos/company-update.dto';

@Injectable()
export class CompanyUpdateService {
  constructor(
    @InjectRepository(CompanyUpdate)
    private companyUpdateRepository: Repository<CompanyUpdate>,
  ) {}

  async create(createCompanyUpdateDto: CreateCompanyUpdateDto): Promise<CompanyUpdate> {
    const companyUpdate = this.companyUpdateRepository.create(createCompanyUpdateDto);
    return await this.companyUpdateRepository.save(companyUpdate);
  }

  async findAll(): Promise<CompanyUpdate[]> {
    return await this.companyUpdateRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async findOne(id: number): Promise<CompanyUpdate> {
    return await this.companyUpdateRepository.findOneBy({ id });
  }

  async update(id: number, updateCompanyUpdateDto: UpdateCompanyUpdateDto): Promise<CompanyUpdate> {
    await this.companyUpdateRepository.update(id, updateCompanyUpdateDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.companyUpdateRepository.update(id, { isActive: false });
  }
}