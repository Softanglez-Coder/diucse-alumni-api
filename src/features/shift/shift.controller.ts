import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { Public, Role, Roles } from '@core';

@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: { name: string }) {
    return await this.shiftService.create(body.name);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.shiftService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.shiftService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return await this.shiftService.update(id, body.name);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.shiftService.delete(id);
  }
}
