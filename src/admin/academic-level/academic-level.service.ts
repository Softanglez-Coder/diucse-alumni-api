import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AcademicLevel,
  AcademicLevelDocument,
} from './schemas/academic-level.schema';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';

@Injectable()
export class AcademicLevelService {
  constructor(
    @InjectModel(AcademicLevel.name)
    private academicModel: Model<AcademicLevelDocument>,
  ) {}

  create(dto: CreateAcademicLevelDto) {
    const created = new this.academicModel(dto);
    return created.save();
  }

  findAll() {
    return this.academicModel.find();
  }

  findOne(id: string) {
    return this.academicModel.findById(id);
  }

  update(id: string, dto: CreateAcademicLevelDto) {
    return this.academicModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.academicModel.findByIdAndDelete(id);
  }
}
