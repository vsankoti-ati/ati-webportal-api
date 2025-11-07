import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressService } from '../services/address.service';
import { CreateAddressDto, UpdateAddressDto } from '../dtos/address.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('addresses')
@UseGuards(RolesGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @Roles('Admin', 'HR')
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @Roles('Admin', 'HR')
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'HR', 'Employee')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Admin', 'HR')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  @Roles('Admin', 'HR')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}