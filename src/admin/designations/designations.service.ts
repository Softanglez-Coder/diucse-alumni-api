import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

import {
  Designation,
  DesignationDocument,
} from './schemas/designations.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class DesignationsService {
  constructor(
    @InjectModel(Designation.name)
    private designationModel: Model<DesignationDocument>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async create(createDesignationDto: any): Promise<Designation> {
    const createdDesignation = new this.designationModel(createDesignationDto);
    await createdDesignation.save();

    await this.cacheManager.del('designations:all');

    return createdDesignation;
  }

  async findAll(): Promise<Designation[]> {
    const cacheKey = 'designations:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Designation[];
    }

    const result = await this.designationModel.find().exec();

    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async findOne(id: string): Promise<Designation> {
    return this.designationModel.findById(id).exec();
  }

  async update(id: string, updateDesignationDto: any): Promise<Designation> {
    const updated = await this.designationModel
      .findByIdAndUpdate(id, updateDesignationDto, { new: true })
      .exec();

    await this.cacheManager.del('designations:all');

    return updated;
  }

  async remove(id: string): Promise<any> {
    const deleted = await this.designationModel.findByIdAndDelete(id).exec();

    await this.cacheManager.del('designations:all');

    return deleted;
  }
}
