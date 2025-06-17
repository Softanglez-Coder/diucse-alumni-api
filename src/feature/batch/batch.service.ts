import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { BatchDocument } from './batch.schema';
import { BatchRepository } from './batch.repository';

@Injectable()
export class BatchService extends BaseService<BatchDocument> {
  constructor(private readonly batchRepository: BatchRepository) {
    super(batchRepository);
  }
}
