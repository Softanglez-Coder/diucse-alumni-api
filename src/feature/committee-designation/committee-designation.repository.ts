import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '@core';
import { CommitteeDesignation, CommitteeDesignationDocument } from './committee-designation.schema';

@Injectable()
export class CommitteeDesignationRepository extends BaseRepository<CommitteeDesignationDocument> {
  constructor(
    @InjectModel(CommitteeDesignation.name)
    private readonly committeeDesignationModel: Model<CommitteeDesignationDocument>,
  ) {
    super(committeeDesignationModel);
  }

  async findByCommitteeId(committeeId: string): Promise<CommitteeDesignationDocument[]> {
    return await this.committeeDesignationModel
      .find({ committeeId: new Types.ObjectId(committeeId), isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .exec();
  }
}
