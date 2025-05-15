import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<Media>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateMediaDto) {
    const created = await this.mediaModel.create(dto);
    await this.cacheManager.del('media:all');
    return created;
  }

  async findAll() {
    const cacheKey = 'media:all';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as Media[];

    const result = await this.mediaModel.find().populate('album');
    await this.cacheManager.set(cacheKey, result, 120);
    return result;
  }

  findOne(id: string) {
    return this.mediaModel.findById(id).populate('album');
  }

  async update(id: string, dto: UpdateMediaDto) {
    const updated = await this.mediaModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    await this.cacheManager.del('media:all');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.mediaModel.findByIdAndDelete(id);
    await this.cacheManager.del('media:all');
    return deleted;
  }
}
