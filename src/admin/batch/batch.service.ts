import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batch, BatchDocument } from './schemas/batch.schema';
import { CreateBatchDto } from './dto/create-batch.dto';

@Injectable()
export class BatchService {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
  ) {}

  create(dto: CreateBatchDto) {
    const created = new this.batchModel(dto);
    return created.save();
  }

  findAll() {
    return this.batchModel.find();
  }

  findOne(id: string) {
    return this.batchModel.findById(id);
  }

  update(id: string, dto: CreateBatchDto) {
    return this.batchModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.batchModel.findByIdAndDelete(id);
  }
}
