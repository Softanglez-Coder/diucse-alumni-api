import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Public, Role, Roles } from '@core';
import { CreateBatchDto, UpdateBatchDto } from './dtos';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Public()
  @Get()
  async findAll() {
    return await this.batchService.findAll({
      sort: 'asc',
      sortBy: 'name',
      limit: 1_000,
    });
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: CreateBatchDto) {
    return await this.batchService.create(body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateBatchDto) {
    return await this.batchService.update(id, body);
  }
}
