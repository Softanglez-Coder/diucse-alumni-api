import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shift, ShiftDocument } from './shift.schema';
import { Model } from 'mongoose';

@Injectable()
export class ShiftRepository {
  constructor(
    @InjectModel(Shift.name) private readonly shiftModel: Model<ShiftDocument>,
  ) {}

  async create(name: string) {
    const shift = new this.shiftModel({ name });
    return await shift.save();
  }

  async findAll() {
    return await this.shiftModel.find().exec();
  }

  async findById(id: string) {
    return await this.shiftModel.findById(id).exec();
  }

  async update(id: string, name: string) {
    return await this.shiftModel
      .findByIdAndUpdate(id, { name }, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.shiftModel.findByIdAndDelete(id).exec();
  }
}
