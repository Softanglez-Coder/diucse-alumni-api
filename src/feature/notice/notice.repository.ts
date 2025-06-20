import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Notice, NoticeDocument } from './notice.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NoticeRepository extends BaseRepository<NoticeDocument> {
  constructor(
    @InjectModel(Notice.name)
    private readonly noticeModel: Model<NoticeDocument>,
  ) {
    super(noticeModel);
  }
}
