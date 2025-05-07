import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

import { Institute, InstituteDocument } from './institute.schema';
import { CreateInstituteDto } from './institute.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class InstituteService {
  constructor(
    @InjectModel(Institute.name)
    private instituteModel: Model<InstituteDocument>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async create(dto: CreateInstituteDto): Promise<Institute> {
    const created = new this.instituteModel(dto);
    await created.save();

    await this.cacheManager.del('institutes:all');

    return created;
  }

  async findAll(): Promise<Institute[]> {
    const cacheKey = 'institutes:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Institute[];
    }

    const result = await this.instituteModel.find().exec();
    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async delete(id: string) {
    const deleted = await this.instituteModel.findByIdAndDelete(id);

    await this.cacheManager.del('institutes:all');

    return deleted;
  }
}
