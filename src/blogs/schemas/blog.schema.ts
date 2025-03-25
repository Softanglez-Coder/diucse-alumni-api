import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


class Author {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

@Schema({ collection: 'blogs' }) 
export class Blog extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ type: Author, required: true }) 
  author: Author;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ type: Author, required: true }) 
  createdBy: Author;

  @Prop()
  modifiedAt?: string;

  @Prop()
  modifiedBy?: Author;

  @Prop()
  deletedAt?: string;

  @Prop()
  deletedBy?: Author;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
