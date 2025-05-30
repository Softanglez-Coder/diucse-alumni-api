import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Batch, BatchDocument } from './batch.schema';
import { Model } from 'mongoose';

@Injectable()
export class BatchRepository {
  constructor(
    @InjectModel(Batch.name) private readonly batchModel: Model<BatchDocument>,
  ) {}

  async create(name: string): Promise<BatchDocument> {
    const batch = new this.batchModel({ name });
    return await batch.save();
  }

  async findById(id: string): Promise<BatchDocument | null> {
    return await this.batchModel.findById(id).exec();
  }

  async findAll(): Promise<BatchDocument[]> {
    return await this.batchModel.find().exec();
  }

  async update(id: string, name: string): Promise<BatchDocument | null> {
    return await this.batchModel
      .findByIdAndUpdate(id, { name }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<BatchDocument | null> {
    return await this.batchModel.findByIdAndDelete(id).exec();
  }
}
