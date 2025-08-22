import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlogRepository extends BaseRepository<BlogDocument> {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {
    super(blogModel);
  }

  async createByDrafting(
    dto: Partial<BlogDocument>,
    userId: string,
  ): Promise<BlogDocument> {
    const blog = new this.blogModel(dto);
    blog.author = userId as any; // Assuming userId is a string that can be cast to ObjectId
    blog.published = false;
    blog.inReview = false;
    return blog.save();
  }
}
