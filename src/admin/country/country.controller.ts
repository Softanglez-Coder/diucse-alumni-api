import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './country.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('admin/countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  create(@Body() dto: CreateCountryDto) {
    return this.countryService.create(dto);
  }

  @Get()
  @CacheTTL(120)
  findAll() {
    return this.countryService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.countryService.delete(id);
  }
}
