import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './country.schema';
import { CreateCountryDto } from './country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    const exists = await this.countryModel.findOne({ name: dto.name });
    if (exists) {
      throw new Error('Country already exists');
    }
    const created = new this.countryModel(dto);
    return created.save();
  }

  async findAll(): Promise<Country[]> {
    return this.countryModel.find().sort({ name: 1 }).exec();
  }

  async delete(id: string): Promise<Country> {
    const deleted = await this.countryModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Country not found');
    }
    return deleted;
  }
}
