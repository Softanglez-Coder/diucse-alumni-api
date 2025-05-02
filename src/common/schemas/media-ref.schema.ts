import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class MediaRef {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;
}

export const MediaRefSchema = SchemaFactory.createForClass(MediaRef);
