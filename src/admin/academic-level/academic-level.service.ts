import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

import {
  AcademicLevel,
  AcademicLevelDocument,
} from './schemas/academic-level.schema';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AcademicLevelService {
  constructor(
    @InjectModel(AcademicLevel.name)
    private academicModel: Model<AcademicLevelDocument>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async create(dto: CreateAcademicLevelDto) {
    const created = new this.academicModel(dto);
    await created.save();

    await this.cacheManager.del('academic-levels:all');

    return created;
  }

  async findAll() {
    const cacheKey = 'academic-levels:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.academicModel.find().exec();

    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async findOne(id: string) {
    return this.academicModel.findById(id);
  }

  async update(id: string, dto: CreateAcademicLevelDto) {
    const updated = await this.academicModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    await this.cacheManager.del('academic-levels:all');

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.academicModel.findByIdAndDelete(id);

    await this.cacheManager.del('academic-levels:all');

    return deleted;
  }
}
