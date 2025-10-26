import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Holiday } from '../entities/holiday.entity';
import { CreateHolidayDto, UpdateHolidayDto } from '../dtos/holiday.dto';

@Injectable()
export class HolidayService {
  constructor(
    @Inject('HOLIDAY_REPOSITORY')
    private holidayRepository: Repository<Holiday>,
  ) {}

  async create(createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    const holiday = this.holidayRepository.create(createHolidayDto);
    return await this.holidayRepository.save(holiday);
  }

  async findAll(): Promise<Holiday[]> {
    return await this.holidayRepository.find({
      relations: ['client'],
      order: { year: 'DESC', dateOfHoliday: 'ASC' },
    });
  }

  async findByClient(clientId: number): Promise<Holiday[]> {
    return await this.holidayRepository.find({
      where: { clientId },
      relations: ['client'],
      order: { year: 'DESC', dateOfHoliday: 'ASC' },
    });
  }

  async findByYear(year: number): Promise<Holiday[]> {
    return await this.holidayRepository.find({
      where: { year },
      relations: ['client'],
      order: { dateOfHoliday: 'ASC' },
    });
  }

  async findByClientAndYear(clientId: number, year: number): Promise<Holiday[]> {
    return await this.holidayRepository.find({
      where: { clientId, year },
      relations: ['client'],
      order: { dateOfHoliday: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Holiday> {
    const holiday = await this.holidayRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    return holiday;
  }

  async update(id: number, updateHolidayDto: UpdateHolidayDto): Promise<Holiday> {
    const holiday = await this.findOne(id);
    
    Object.assign(holiday, updateHolidayDto);
    holiday.updatedAt = new Date();
    
    return await this.holidayRepository.save(holiday);
  }

  async remove(id: number): Promise<void> {
    const holiday = await this.findOne(id);
    await this.holidayRepository.remove(holiday);
  }
}
