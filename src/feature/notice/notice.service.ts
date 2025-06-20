import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { NoticeDocument } from './notice.schema';
import { NoticeRepository } from './notice.repository';

@Injectable()
export class NoticeService extends BaseService<NoticeDocument> {
  constructor(private readonly noticeRepository: NoticeRepository) {
    super(noticeRepository);
  }
}
