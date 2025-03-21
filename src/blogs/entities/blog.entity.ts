import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Defining the BlogDocument type which extends Blog and Document
export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  // Unique identifier for the blog, required field
  @Prop({ required: true })
  id: string;

  // Title of the blog, required field
  @Prop({ required: true })
  title: string;

  // Content of the blog, required field
  @Prop({ required: true })
  content: string;

  // Author object, containing id and name of the author
  @Prop({ type: Object })
  author: { id: string; name: string };

  // Creation timestamp of the blog, required field
  @Prop({ required: true })
  createdAt: string;

  // CreatedBy object, containing id and name of the creator
  @Prop({ type: Object })
  createdBy: { id: string; name: string };

  // ModifiedAt timestamp, optional field, defaults to null if not provided
  @Prop({ type: String, default: null })
  modifiedAt?: string | null;

  // ModifiedBy object, containing id and name of the person who modified the blog, optional field
  @Prop({ type: Object, default: null })
  modifiedBy?: { id: string; name: string } | null;

  // DeletedAt timestamp, optional field, defaults to null if not provided
  @Prop({ type: String, default: null })
  deletedAt?: string | null;

  // DeletedBy object, containing id and name of the person who deleted the blog, optional field
  @Prop({ type: Object, default: null })
  deletedBy?: { id: string; name: string } | null;
}

// Create a Mongoose schema for the Blog class
export const BlogSchema = SchemaFactory.createForClass(Blog);
