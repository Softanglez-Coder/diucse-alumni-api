import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true })
export class Notice {
  @Prop({ required: true }) title: string;
  @Prop() description: string;
  @Prop() link: string; 
}
export const NoticeSchema = SchemaFactory.createForClass(Notice);
