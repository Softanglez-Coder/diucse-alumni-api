import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@core';
import { CommitteeMember, CommitteeMemberDocument } from './committee-member.schema';

@Injectable()
export class CommitteeMemberRepository extends BaseRepository<CommitteeMemberDocument> {
  constructor(
    @InjectModel(CommitteeMember.name)
    private readonly committeeMemberModel: Model<CommitteeMemberDocument>,
  ) {
    super(committeeMemberModel);
  }

  async findByCommitteeId(committeeId: string, activeOnly = true): Promise<CommitteeMemberDocument[]> {
    const filter: any = { committeeId };
    if (activeOnly) {
      filter.isActive = true;
    }
    
    return await this.committeeMemberModel
      .find(filter)
      .populate('designationId')
      .populate('userId', 'name email avatar')
      .exec();
  }

  async findByUserId(userId: string, activeOnly = true): Promise<CommitteeMemberDocument[]> {
    const filter: any = { userId };
    if (activeOnly) {
      filter.isActive = true;
    }
    
    return await this.committeeMemberModel
      .find(filter)
      .populate('committeeId')
      .populate('designationId')
      .exec();
  }

  async findActiveByUserAndCommittee(userId: string, committeeId: string): Promise<CommitteeMemberDocument | null> {
    return await this.committeeMemberModel
      .findOne({ userId, committeeId, isActive: true })
      .populate('designationId')
      .exec();
  }

  async findActiveByDesignationAndCommittee(designationId: string, committeeId: string): Promise<CommitteeMemberDocument | null> {
    return await this.committeeMemberModel
      .findOne({ designationId, committeeId, isActive: true })
      .populate('userId', 'name email avatar')
      .exec();
  }
}
