import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogController, BlogRepository, BlogSchema, BlogService } from "./blog";
import { BlogComment, BlogCommentController, BlogCommentRepository, BlogCommentSchema, BlogCommentService } from "./blog-comment";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: BlogComment.name,
        schema: BlogCommentSchema,
      }
    ]),
  ],
  providers: [
    Logger,
    
    BlogService,
    BlogRepository,

    BlogCommentService,
    BlogCommentRepository
  ],
  controllers: [
    BlogController,
    BlogCommentController
  ],
})
export class BlogModule {}
