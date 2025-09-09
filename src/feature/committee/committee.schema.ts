import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'committees',
})
export class Committee {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Date,
    required: true,
  })
  startDate: Date;

  @Prop({
    type: Date,
    required: true,
  })
  endDate: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPublished: boolean;
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
export type CommitteeDocument = HydratedDocument<Committee>;
