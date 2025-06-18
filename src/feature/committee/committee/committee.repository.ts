import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Committee, CommitteeDocument } from './committee.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommitteeRepository extends BaseRepository<CommitteeDocument> {
  constructor(
    @InjectModel(Committee.name)
    private readonly committeeModel: Model<CommitteeDocument>,
  ) {
    super(committeeModel);
  }
}
