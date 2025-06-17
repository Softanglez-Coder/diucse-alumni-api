import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'notices',
})
export class Notice {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
    maxlength: 5_000,
    minlength: 1,
  })
  content: string;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  published: boolean;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
NoticeSchema.plugin(require('mongoose-autopopulate'));

export type NoticeDocument = HydratedDocument<Notice>;
