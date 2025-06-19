import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Blog, BlogDocument } from '../blog/blog.schema';
import { UserDocument } from 'src/feature/user';
import { User } from '@auth0/auth0-spa-js';

@Schema({
  timestamps: true,
  collection: 'blog_comments',
})
export class BlogComment {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Blog.name,
    autopopulate: true,
  })
  blog: mongoose.Schema.Types.ObjectId | BlogDocument;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: BlogComment.name,
    autopopulate: true,
  })
  comment?: mongoose.Schema.Types.ObjectId | BlogCommentDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: mongoose.Schema.Types.ObjectId | UserDocument;

  @Prop({
    required: true,
    type: String,
    trim: true,
    maxlength: 5_000,
    minlength: 1,
  })
  content: string;

  @Prop({
    required: false,
    type: Number,
    default: 0,
    min: 0,
  })
  likes: number;

  @Prop({
    required: false,
    type: Number,
    default: 0,
    min: 0,
  })
  dislikes: number;
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
BlogCommentSchema.plugin(require('mongoose-autopopulate'));
export type BlogCommentDocument = HydratedDocument<BlogComment>;
