import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import {
  CommitteeDesignation,
  CommitteeDesignationDocument,
} from './committee-designation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommitteeDesignationRepository extends BaseRepository<CommitteeDesignationDocument> {
  constructor(
    @InjectModel(CommitteeDesignation.name)
    private readonly committeeDesignationModel: Model<CommitteeDesignationDocument>,
  ) {
    super(committeeDesignationModel);
  }
}
