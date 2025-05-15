import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './schemas/album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateAlbumDto) {
    const created = await this.albumModel.create(dto);
    await this.cacheManager.del('albums:all'); // Invalidate cache
    return created;
  }

  async findAll() {
    const cacheKey = 'albums:all';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as Album[];

    const result = await this.albumModel.find();
    await this.cacheManager.set(cacheKey, result, 120); // TTL 2 min
    return result;
  }

  findOne(id: string) {
    return this.albumModel.findById(id);
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const updated = await this.albumModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    await this.cacheManager.del('albums:all'); // Invalidate cache
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.albumModel.findByIdAndDelete(id);
    await this.cacheManager.del('albums:all'); // Invalidate cache
    return deleted;
  }
}
