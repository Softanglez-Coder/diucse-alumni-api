import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { BlogComment, BlogCommentDocument } from './blog-comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlogCommentRepository extends BaseRepository<BlogCommentDocument> {
  constructor(
    @InjectModel(BlogComment.name)
    private readonly blogCommentModel: Model<BlogCommentDocument>,
  ) {
    super(blogCommentModel);
  }
}
