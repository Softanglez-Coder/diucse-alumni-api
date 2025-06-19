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
}
