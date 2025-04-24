import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommitteeDocument = Committee & Document;

@Schema({ timestamps: true })
export class Committee {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) officeStartDate: string;
  @Prop({ required: true }) officeEndDate: string;
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
