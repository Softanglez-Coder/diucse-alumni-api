import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BatchDocument = Batch & Document;

@Schema()
export class Batch {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
