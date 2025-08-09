import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'batches',
})
export class Batch {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
export type BatchDocument = HydratedDocument<Batch>;
