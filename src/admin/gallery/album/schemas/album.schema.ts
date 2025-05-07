import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Album extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
