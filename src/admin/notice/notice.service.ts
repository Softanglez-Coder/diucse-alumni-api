import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    return this.noticeModel.create(createNoticeDto);
  }

  async findAll(): Promise<Notice[]> {
    return this.noticeModel.find().sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<Notice> {
    const notice = await this.noticeModel.findById(id);
    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  async update(id: string, updateNoticeDto: UpdateNoticeDto): Promise<Notice> {
    const updated = await this.noticeModel.findByIdAndUpdate(
      id,
      updateNoticeDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Notice not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noticeModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Notice not found');
  }
}
