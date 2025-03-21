// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type BlogDocument = Blog & Document;

// @Schema()
// export class Blog {
//   @Prop({ required: true })
//   id: string;

//   @Prop({ required: true })
//   title: string;

//   @Prop({ required: true })
//   content: string;

//   @Prop({ type: Object })
//   author: { id: string; name: string };

//   @Prop({ required: true })
//   createdAt: string;

//   @Prop({ type: Object })
//   createdBy: { id: string; name: string };

//   @Prop({ type: String, default: null })
//   modifiedAt?: string | null;

//   @Prop({ type: Object, default: null })
//   modifiedBy?: { id: string; name: string } | null;

//   @Prop({ type: String, default: null })
//   deletedAt?: string | null;

//   @Prop({ type: Object, default: null })
//   deletedBy?: { id: string; name: string } | null;
// }

// export const BlogSchema = SchemaFactory.createForClass(Blog);






// //mongodb er jonno 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Object })
  author: { id: string; name: string };

  @Prop({ required: true })
  createdAt: string;

  @Prop({ type: Object })
  createdBy: { id: string; name: string };

  @Prop({ type: String, default: null })
  modifiedAt?: string | null;

  @Prop({ type: Object, default: null })
  modifiedBy?: { id: string; name: string } | null;

  @Prop({ type: String, default: null })
  deletedAt?: string | null;

  @Prop({ type: Object, default: null })
  deletedBy?: { id: string; name: string } | null;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);




