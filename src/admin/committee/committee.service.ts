import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Committee, CommitteeDocument } from './schemas/committee.schema';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';

@Injectable()
export class CommitteeService {
  constructor(
    @InjectModel(Committee.name)
    private readonly committeeModel: Model<CommitteeDocument>,
  ) {}

  async create(dto: CreateCommitteeDto): Promise<Committee> {
    const created = new this.committeeModel(dto);
    return created.save();
  }

  async findAll(): Promise<Committee[]> {
    return this.committeeModel.find().exec();
  }

  async findOne(id: string): Promise<Committee> {
    const doc = await this.committeeModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Committee member not found');
    return doc;
  }

  async update(id: string, dto: UpdateCommitteeDto): Promise<Committee> {
    const updated = await this.committeeModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Committee member not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.committeeModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Committee member not found');
  }
}
