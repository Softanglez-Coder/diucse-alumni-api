import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

import { Profession, ProfessionDocument } from './profession.schema';
import { CreateProfessionDto } from './profession.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectModel(Profession.name)
    private professionModel: Model<ProfessionDocument>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async create(dto: CreateProfessionDto): Promise<Profession> {
    const created = new this.professionModel(dto);
    await created.save();

    await this.cacheManager.del('professions:all');

    return created;
  }

  async findAll(): Promise<Profession[]> {
    const cacheKey = 'professions:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Profession[];
    }

    const result = await this.professionModel.find().exec();
    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async delete(id: string) {
    const deleted = await this.professionModel.findByIdAndDelete(id);

    await this.cacheManager.del('professions:all');

    return deleted;
  }
}
