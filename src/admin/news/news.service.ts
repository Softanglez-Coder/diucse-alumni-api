import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    const result = await createdNews.save();

    await this.cacheManager.del('news:all');
    return result;
  }

  async findAll(): Promise<News[]> {
    const cacheKey = 'news:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as News[];
    }

    const result = await this.newsModel.find().sort({ date: -1 }).exec();
    await this.cacheManager.set(cacheKey, result, 120);
    return result;
  }

  async findOne(id: string): Promise<News> {
    const cacheKey = `news:${id}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as News;
    }

    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException('News not found');
    }

    await this.cacheManager.set(cacheKey, news, 120);
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, { new: true })
      .exec();

    if (!updatedNews) {
      throw new NotFoundException('News not found');
    }

    await this.cacheManager.del('news:all');
    await this.cacheManager.del(`news:${id}`);
    return updatedNews;
  }

  async remove(id: string): Promise<void> {
    const result = await this.newsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('News not found');
    }

    await this.cacheManager.del('news:all');
    await this.cacheManager.del(`news:${id}`);
  }
}
