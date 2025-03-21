import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog, BlogDocument } from './entities/blog.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  // Create
  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const author = createBlogDto.author?.id
      ? createBlogDto.author
      : { id: uuidv4(), name: 'shamim' };

    const newBlog = new this.blogModel({
      id: uuidv4(),
      author,
      content: createBlogDto.content,
      title: createBlogDto.title,
      createdAt: new Date().toISOString(),
      createdBy: { id: uuidv4(), name: 'System Bot' },
    });

    const savedBlog = await newBlog.save();
    return savedBlog;
  }

  // Get All
  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  // Get by ID
  async findOne(id: string): Promise<Blog | null> {
    return this.blogModel.findOne({ id }).exec();
  }

  // Update
  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog | null> {
    const updatedBlog = await this.blogModel
      .findOneAndUpdate(
        { id },
        {
          $set: {
            ...updateBlogDto,
            modifiedAt: new Date().toISOString(),
            modifiedBy: { id: uuidv4(), name: 'shamim' },
          },
        },
        { new: true },
      )
      .exec();

    return updatedBlog;
  }

  // Soft Delete (Temporary)
  async remove(id: string): Promise<Blog | null> {
    const deletedBlog = await this.blogModel
      .findOneAndUpdate(
        { id },
        {
          $set: {
            deletedAt: new Date().toISOString(),
            deletedBy: { id: uuidv4(), name: 'shamim' },
          },
        },
        { new: true },
      )
      .exec();

    return deletedBlog;
  }

  // Restore Soft Deleted Blog
  async restore(id: string): Promise<Blog | null> {
    const blog = await this.blogModel
      .findOne({ id, deletedAt: { $ne: null } })
      .exec();

    if (!blog || !blog.deletedAt) return null;

    blog.deletedAt = undefined;
    blog.deletedBy = undefined;
    blog.modifiedAt = new Date().toISOString();

    return blog.save();
  }

  // Permanently Delete
  async deletePermanently(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
}
