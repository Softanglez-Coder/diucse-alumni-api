import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './profession.dto';

@Controller('admin/professions')
export class ProfessionController {
  constructor(private readonly service: ProfessionService) {}

  @Post()
  create(@Body() dto: CreateProfessionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
