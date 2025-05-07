import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Notice, NoticeDocument } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const result = await this.noticeModel.create(createNoticeDto);
    await this.cacheManager.del('notices:all');
    return result;
  }

  async findAll(): Promise<Notice[]> {
    const cacheKey = 'notices:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Notice[];
    }

    const result = await this.noticeModel.find().sort({ date: -1 }).exec();
    await this.cacheManager.set(cacheKey, result, 120);
    return result;
  }

  async findOne(id: string): Promise<Notice> {
    const cacheKey = `notice:${id}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Notice;
    }

    const notice = await this.noticeModel.findById(id).exec();
    if (!notice) throw new NotFoundException('Notice not found');

    await this.cacheManager.set(cacheKey, notice, 120);
    return notice;
  }

  async update(id: string, updateNoticeDto: UpdateNoticeDto): Promise<Notice> {
    const updated = await this.noticeModel.findByIdAndUpdate(
      id,
      updateNoticeDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Notice not found');

    await this.cacheManager.del('notices:all');
    await this.cacheManager.del(`notice:${id}`);

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noticeModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Notice not found');

    await this.cacheManager.del('notices:all');
    await this.cacheManager.del(`notice:${id}`);
  }
}
