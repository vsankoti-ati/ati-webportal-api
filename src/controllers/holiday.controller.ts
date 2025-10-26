import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HolidayService } from '../services/holiday.service';
import { CreateHolidayDto, UpdateHolidayDto } from '../dtos/holiday.dto';
import { Result } from '../utils/result';
import { Public } from '../auth/public.decorator';

@Controller('holidays')
@Public()
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createHolidayDto: CreateHolidayDto) {
    try {
      const holiday = await this.holidayService.create(createHolidayDto);
      return Result.success(holiday, 'Holiday created successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Get()
  async findAll(
    @Query('clientId', ParseIntPipe) clientId?: number,
    @Query('year', ParseIntPipe) year?: number,
  ) {
    try {
      let holidays;
      
      if (clientId && year) {
        holidays = await this.holidayService.findByClientAndYear(clientId, year);
      } else if (clientId) {
        holidays = await this.holidayService.findByClient(clientId);
      } else if (year) {
        holidays = await this.holidayService.findByYear(year);
      } else {
        holidays = await this.holidayService.findAll();
      }
      
      return Result.success(holidays, 'Holidays retrieved successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const holiday = await this.holidayService.findOne(id);
      return Result.success(holiday, 'Holiday retrieved successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ) {
    try {
      const holiday = await this.holidayService.update(id, updateHolidayDto);
      return Result.success(holiday, 'Holiday updated successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.holidayService.remove(id);
      return Result.success(null, 'Holiday deleted successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }
}
