import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { CreateClientDto, UpdateClientDto } from '../dtos/client.dto';
import { Result } from '../utils/result';
import { Public } from '../auth/public.decorator';

@Controller('clients')
@Public()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto) {
    try {
      const client = await this.clientService.create(createClientDto);
      return Result.success(client, 'Client created successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const clients = await this.clientService.findAll();
      return Result.success(clients, 'Clients retrieved successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const client = await this.clientService.findOne(id);
      return Result.success(client, 'Client retrieved successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    try {
      const client = await this.clientService.update(id, updateClientDto);
      return Result.success(client, 'Client updated successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.clientService.remove(id);
      return Result.success(null, 'Client deleted successfully');
    } catch (error) {
      return Result.error(error.message);
    }
  }
}
