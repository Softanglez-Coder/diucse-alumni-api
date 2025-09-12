import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@core';
import { Committee, CommitteeDocument } from './committee.schema';

@Injectable()
export class CommitteeRepository extends BaseRepository<CommitteeDocument> {
  constructor(
    @InjectModel(Committee.name)
    private readonly committeeModel: Model<CommitteeDocument>,
  ) {
    super(committeeModel);
  }
}
