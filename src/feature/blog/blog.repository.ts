import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument, BlogStatus } from './blog.schema';
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
    blog.status = BlogStatus.DRAFT;
    return blog.save();
  }

  async findByStatus(status: BlogStatus): Promise<BlogDocument[]> {
    return this.blogModel.find({ status }).exec();
  }

  async findPublishedBlogs(): Promise<BlogDocument[]> {
    return this.findByStatus(BlogStatus.PUBLISHED);
  }

  async findBlogsInReview(): Promise<BlogDocument[]> {
    return this.findByStatus(BlogStatus.IN_REVIEW);
  }

  async findDraftBlogs(): Promise<BlogDocument[]> {
    return this.findByStatus(BlogStatus.DRAFT);
  }

  async findByStatusAndAuthor(
    status: BlogStatus,
    authorId: string,
  ): Promise<BlogDocument[]> {
    return this.blogModel.find({ status, author: authorId }).exec();
  }
}
