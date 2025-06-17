import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Member, MemberDocument } from '../../member/member.schema';
import { BlogType } from './blog-type';

@Schema({
  timestamps: true,
  collection: 'blogs',
})
export class Blog {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Member.name,
    autopopulate: true,
  })
  author: mongoose.Schema.Types.ObjectId | MemberDocument;

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
