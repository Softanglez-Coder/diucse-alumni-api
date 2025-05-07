import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Committee, CommitteeDocument } from './schemas/committee.schema';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';

@Injectable()
export class CommitteeService {
  constructor(
    @InjectModel(Committee.name)
    private readonly committeeModel: Model<CommitteeDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(dto: CreateCommitteeDto): Promise<Committee> {
    const created = new this.committeeModel(dto);
    const result = await created.save();

    await this.cacheManager.del('committees:all');

    return result;
  }

  async findAll(): Promise<Committee[]> {
    const cacheKey = 'committees:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Committee[];
    }

    const result = await this.committeeModel.find().sort({ year: -1 }).exec();
    await this.cacheManager.set(cacheKey, result, 120);
    return result;
  }

  async findOne(id: string): Promise<Committee> {
    const cacheKey = `committee:${id}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Committee;
    }

    const doc = await this.committeeModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Committee not found');

    await this.cacheManager.set(cacheKey, doc, 120);

    return doc;
  }

  async update(id: string, dto: UpdateCommitteeDto): Promise<Committee> {
    const updated = await this.committeeModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Committee member not found');

    await this.cacheManager.del(`committee:${id}`);
    await this.cacheManager.del('committees:all');

    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.committeeModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Committee member not found');

    await this.cacheManager.del(`committee:${id}`);
    await this.cacheManager.del('committees:all');
  }
}
