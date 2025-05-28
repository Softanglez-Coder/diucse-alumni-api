import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { Public, Role, Roles } from '@core';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: { name: string }) {
    const { name } = body;
    return await this.batchService.create(name);
  }

  @Public()
  @Get()
  findAll() {
    return this.batchService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.batchService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    const { name } = body;
    return await this.batchService.update(id, name);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.batchService.delete(id);
  }
}
