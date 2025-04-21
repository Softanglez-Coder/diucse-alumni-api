import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PassingYear,
  PassingYearDocument,
} from './schemas/passing-year.schema';
import { CreatePassingYearDto } from './dto/create-passing-year.dto';

@Injectable()
export class PassingYearService {
  constructor(
    @InjectModel(PassingYear.name)
    private passingYearModel: Model<PassingYearDocument>,
  ) {}

  create(dto: CreatePassingYearDto) {
    const created = new this.passingYearModel(dto);
    return created.save();
  }

  findAll() {
    return this.passingYearModel.find();
  }

  findOne(id: string) {
    return this.passingYearModel.findById(id);
  }

  update(id: string, dto: CreatePassingYearDto) {
    return this.passingYearModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.passingYearModel.findByIdAndDelete(id);
  }
}
