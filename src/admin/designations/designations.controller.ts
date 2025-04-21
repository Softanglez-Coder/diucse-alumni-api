import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { DesignationsService } from './designations.service';

@Controller('designations')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  // Create a new designation
  @Post()
  async create(@Body() createDesignationDto: any) {
    return this.designationsService.create(createDesignationDto);
  }

  @Get()
  async findAll() {
    return this.designationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.designationsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDesignationDto: any) {
    return this.designationsService.update(id, updateDesignationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.designationsService.remove(id);
  }
}
