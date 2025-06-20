import { BaseController } from '@core';
import { Controller } from '@nestjs/common';
import { BlogCommentDocument } from './blog-comment.schema';
import { BlogCommentService } from './blog-comment.service';

@Controller('blog-comment')
export class BlogCommentController extends BaseController<BlogCommentDocument> {
  constructor(private readonly blogCommentService: BlogCommentService) {
    super(blogCommentService);
  }
}
