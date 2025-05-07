import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

import { Batch, BatchDocument } from './schemas/batch.schema';
import { CreateBatchDto } from './dto/create-batch.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class BatchService {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async create(dto: CreateBatchDto) {
    const created = new this.batchModel(dto);
    await created.save();

    await this.cacheManager.del('batches:all');

    return created;
  }

  async findAll() {
    const cacheKey = 'batches:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.batchModel.find().exec();

    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async findOne(id: string) {
    return this.batchModel.findById(id);
  }

  async update(id: string, dto: CreateBatchDto) {
    const updated = await this.batchModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    await this.cacheManager.del('batches:all');

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.batchModel.findByIdAndDelete(id);

    await this.cacheManager.del('batches:all');

    return deleted;
  }
}
