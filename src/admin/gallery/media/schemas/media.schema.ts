import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SchemaNames } from 'src/common/schema-names.enum';

@Schema()
export class Media extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Types.ObjectId, ref: SchemaNames.Album, required: false })
  album?: Types.ObjectId;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
