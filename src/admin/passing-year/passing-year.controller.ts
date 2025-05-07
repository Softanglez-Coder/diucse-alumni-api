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
import { PassingYearService } from './passing-year.service';
import { CreatePassingYearDto } from './dto/create-passing-year.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('passing-years')
export class PassingYearController {
  constructor(private readonly service: PassingYearService) { }

  @Post()
  create(@Body() dto: CreatePassingYearDto) {
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
  update(@Param('id') id: string, @Body() dto: CreatePassingYearDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
