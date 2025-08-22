import { BaseService } from '@core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BlogDocument } from './blog.schema';
import { BlogRepository } from './blog.repository';
import { CreateBlogDto } from './dtos';

@Injectable()
export class BlogService extends BaseService<BlogDocument> {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly logger: Logger,
  ) {
    super(blogRepository);
  }

  override async create(dto: CreateBlogDto, userId?: string) {
    this.logger.log(`Creating blog by drafting for user with id: ${userId}`);

    const blogModel = this.blogRepository.getModel();
    const blog = new blogModel(dto);
    blog.author = userId as any; // Assuming userId is a string that can be cast to ObjectId
    blog.published = false;
    blog.inReview = false;
    const createdBlog = await blog.save();

    this.logger.log(`Blog created with id: ${createdBlog._id}`);
    return createdBlog;
  }

  async getMyBlogs(userId: string): Promise<BlogDocument[]> {
    this.logger.log(`Fetching blogs for user with id: ${userId}`);

    const blogs = await this.blogRepository
      .getModel()
      .find({ author: userId })
      .exec();

    if (!blogs || blogs.length === 0) {
      this.logger.warn(`No blogs found for user with id: ${userId}`);
      return [];
    }

    return blogs;
  }

  async draft(id: string): Promise<BlogDocument> {
    this.logger.log(`Drafting blog with id: ${id}`);

    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      this.logger.error(`Blog with id ${id} not found`);
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    blog.published = false;
    blog.inReview = false;

    return await this.blogRepository.update(id, blog);
  }

  async review(id: string): Promise<BlogDocument> {
    this.logger.log(`Reviewing blog with id: ${id}`);

    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      this.logger.error(`Blog with id ${id} not found`);
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    blog.inReview = true;
    blog.published = false;

    return await this.blogRepository.update(id, blog);
  }

  async publish(id: string): Promise<BlogDocument> {
    this.logger.log(`Publishing blog with id: ${id}`);

    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      this.logger.error(`Blog with id ${id} not found`);
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    blog.published = true;
    blog.inReview = false;

    return await this.blogRepository.update(id, blog);
  }

  async unpublish(id: string): Promise<BlogDocument> {
    this.logger.log(`Unpublishing blog with id: ${id}`);

    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      this.logger.error(`Blog with id ${id} not found`);
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    blog.published = false;
    blog.inReview = false;

    return await this.blogRepository.update(id, blog);
  }
}
