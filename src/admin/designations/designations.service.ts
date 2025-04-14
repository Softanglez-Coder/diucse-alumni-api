import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Designation,
  DesignationDocument,
} from './schemas/designations.schema';


@Injectable()
export class DesignationsService {
  constructor(
    @InjectModel(Designation.name)
    private designationModel: Model<DesignationDocument>,
  ) {}

  
  async create(createDesignationDto: any): Promise<Designation> {
    const createdDesignation = new this.designationModel(createDesignationDto);
    return createdDesignation.save();
  }

  async findAll(): Promise<Designation[]> {
    return this.designationModel.find().exec();
  }

  async findOne(id: string): Promise<Designation> {
    return this.designationModel.findById(id).exec();
  }

  async update(id: string, updateDesignationDto: any): Promise<Designation> {
    return this.designationModel
      .findByIdAndUpdate(id, updateDesignationDto, { new: true })
      .exec();
  }


  async remove(id: string): Promise<any> {
    return this.designationModel.findByIdAndDelete(id).exec();
  }
}
