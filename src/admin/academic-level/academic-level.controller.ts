import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AcademicLevelService } from './academic-level.service';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('academic-levels')
export class AcademicLevelController {
  constructor(private readonly service: AcademicLevelService) {}

  @Post()
  create(@Body() dto: CreateAcademicLevelDto) {
    return this.service.create(dto);
  }

  @Get()
  @CacheTTL(120)
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
