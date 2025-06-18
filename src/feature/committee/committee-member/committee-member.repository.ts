import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import {
  CommitteeMember,
  CommitteeMemberDocument,
} from './committee-member.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommitteeMemberRepository extends BaseRepository<CommitteeMemberDocument> {
  constructor(
    @InjectModel(CommitteeMember.name)
    private readonly committeeMemberModel: Model<CommitteeMemberDocument>,
  ) {
    super(committeeMemberModel);
  }
}
