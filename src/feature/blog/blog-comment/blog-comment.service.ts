import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { BlogCommentDocument } from './blog-comment.schema';
import { BlogCommentRepository } from './blog-comment.repository';

@Injectable()
export class BlogCommentService extends BaseService<BlogCommentDocument> {
  constructor(private readonly blogCommentRepository: BlogCommentRepository) {
    super(blogCommentRepository);
  }
}
