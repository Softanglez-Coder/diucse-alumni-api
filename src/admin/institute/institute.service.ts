import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institute, InstituteDocument } from './institute.schema';
import { CreateInstituteDto } from './institute.dto';

@Injectable()
export class InstituteService {
  constructor(
    @InjectModel(Institute.name)
    private instituteModel: Model<InstituteDocument>,
  ) {}

  async create(dto: CreateInstituteDto): Promise<Institute> {
    const created = new this.instituteModel(dto);
    return created.save();
  }

  async findAll(): Promise<Institute[]> {
    return this.instituteModel.find().exec();
  }

  async delete(id: string) {
    return this.instituteModel.findByIdAndDelete(id);
  }
}
