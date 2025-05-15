import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

import {
  PassingYear,
  PassingYearDocument,
} from './schemas/passing-year.schema';
import { CreatePassingYearDto } from './dto/create-passing-year.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PassingYearService {
  constructor(
    @InjectModel(PassingYear.name)
    private passingYearModel: Model<PassingYearDocument>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache, // Redis cache inject
  ) { }

  async create(dto: CreatePassingYearDto) {
    const created = new this.passingYearModel(dto);
    await created.save();

    // Invalidate cache after new creation
    await this.cacheManager.del('passing-years:all');

    return created;
  }

  async findAll() {
    const cacheKey = 'passing-years:all';

    // Check cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as PassingYear[];
    }

    // If not cached, fetch from DB and store in cache
    const result = await this.passingYearModel.find();
    await this.cacheManager.set(cacheKey, result, 120); // TTL 2 min

    return result;
  }

  findOne(id: string) {
    return this.passingYearModel.findById(id);
  }

  update(id: string, dto: CreatePassingYearDto) {
    return this.passingYearModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string) {
    const deleted = await this.passingYearModel.findByIdAndDelete(id);

    // Invalidate cache after deletion
    await this.cacheManager.del('passing-years:all');

    return deleted;
  }
}
