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

  @Prop({
    type: String,
    default: '',
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
  })
  passingYear: number;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
export type BatchDocument = HydratedDocument<Batch>;
