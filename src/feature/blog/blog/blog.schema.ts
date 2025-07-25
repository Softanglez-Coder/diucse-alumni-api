import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BlogType } from './blog-type';
import { User } from '@auth0/auth0-spa-js';
import { UserDocument } from 'src/feature/user';

@Schema({
  timestamps: true,
  collection: 'blogs',
})
export class Blog {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  author: mongoose.Schema.Types.ObjectId | UserDocument;

  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
  })
  content: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  published?: boolean;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(BlogType),
    default: BlogType.General,
  })
  type?: BlogType;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.plugin(require('mongoose-autopopulate'));

export type BlogDocument = HydratedDocument<Blog>;
