import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BaseController, Role, Roles } from '@core';
import { CreateBatchDto, UpdateBatchDto } from './dtos';
import { BatchDocument } from './batch.schema';

@Controller('batches')
export class BatchController extends BaseController<BatchDocument> {
  constructor(private readonly batchService: BatchService) {
    super(batchService);
  }

  @Roles(Role.Guest)
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
