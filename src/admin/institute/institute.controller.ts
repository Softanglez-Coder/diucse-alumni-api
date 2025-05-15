import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { CreateInstituteDto } from './institute.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('admin/institutes')
export class InstituteController {
  constructor(private readonly service: InstituteService) { }

  @Post()
  create(@Body() dto: CreateInstituteDto) {
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
