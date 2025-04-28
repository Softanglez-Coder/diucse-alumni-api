import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './country.dto';

@Controller('admin/countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  create(@Body() dto: CreateCountryDto) {
    return this.countryService.create(dto);
  }

  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.countryService.delete(id);
  }
}
