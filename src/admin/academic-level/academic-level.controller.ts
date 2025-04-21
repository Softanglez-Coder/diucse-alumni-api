import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AcademicLevelService } from './academic-level.service';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';

@Controller('academic-levels')
export class AcademicLevelController {
  constructor(private readonly service: AcademicLevelService) {}

  @Post()
  create(@Body() dto: CreateAcademicLevelDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateAcademicLevelDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
