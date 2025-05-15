import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

import { Country, CountryDocument } from './country.schema';
import { CreateCountryDto } from './country.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    const exists = await this.countryModel.findOne({ name: dto.name });
    if (exists) {
      throw new Error('Country already exists');
    }

    const created = new this.countryModel(dto);
    await created.save();

    await this.cacheManager.del('countries:all');

    return created;
  }

  async findAll(): Promise<Country[]> {
    const cacheKey = 'countries:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Country[];
    }

    const result = await this.countryModel.find().sort({ name: 1 }).exec();

    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async delete(id: string): Promise<Country> {
    const deleted = await this.countryModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Country not found');
    }

    await this.cacheManager.del('countries:all');

    return deleted;
  }
}
