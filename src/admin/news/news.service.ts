import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';


@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}


  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

 
  async findAll(): Promise<News[]> {
    return this.newsModel.find().exec();
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  
  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, {
        new: true,
      })
      .exec();
    if (!updatedNews) {
      throw new NotFoundException('News not found');
    }
    return updatedNews;
  }

  // Delete news
  async remove(id: string): Promise<void> {
    const result = await this.newsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('News not found');
    }
  }
}
