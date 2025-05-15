import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './profession.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('admin/professions')
export class ProfessionController {
  constructor(private readonly service: ProfessionService) {}

  @Post()
  create(@Body() dto: CreateProfessionDto) {
    return this.service.create(dto);
  }

  @Get()
  @CacheTTL(120)
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
