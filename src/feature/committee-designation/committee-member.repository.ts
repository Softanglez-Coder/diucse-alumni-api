import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '@core';
import {
  CommitteeMember,
  CommitteeMemberDocument,
} from './committee-member.schema';

@Injectable()
export class CommitteeMemberRepository extends BaseRepository<CommitteeMemberDocument> {
  constructor(
    @InjectModel(CommitteeMember.name)
    private readonly committeeMemberModel: Model<CommitteeMemberDocument>,
  ) {
    super(committeeMemberModel);
  }

  async findByCommitteeId(
    committeeId: string,
    activeOnly = true,
  ): Promise<CommitteeMemberDocument[]> {
    const filter: any = { committeeId: new Types.ObjectId(committeeId) };
    if (activeOnly) {
      filter.isActive = true;
    }

    return await this.committeeMemberModel
      .find(filter)
      .populate('designationId')
      .populate('userId', 'name email photo')
      .exec();
  }

  async findByUserId(
    userId: string,
    activeOnly = true,
  ): Promise<CommitteeMemberDocument[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (activeOnly) {
      filter.isActive = true;
    }

    return await this.committeeMemberModel
      .find(filter)
      .populate('committeeId')
      .populate('designationId')
      .exec();
  }

  async findActiveByUserAndCommittee(
    userId: string,
    committeeId: string,
  ): Promise<CommitteeMemberDocument | null> {
    return await this.committeeMemberModel
      .findOne({
        userId: new Types.ObjectId(userId),
        committeeId: new Types.ObjectId(committeeId),
        isActive: true,
      })
      .populate('designationId')
      .exec();
  }

  async findActiveByDesignationAndCommittee(
    designationId: string,
    committeeId: string,
  ): Promise<CommitteeMemberDocument | null> {
    return await this.committeeMemberModel
      .findOne({
        designationId: new Types.ObjectId(designationId),
        committeeId: new Types.ObjectId(committeeId),
        isActive: true,
      })
      .populate('userId', 'name email avatar')
      .exec();
  }
}
