import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommitteeDocument = Committee & Document;

@Schema({ timestamps: true })
export class Committee {
  @Prop({ required: true }) fullName: string;
  @Prop({ required: true }) position: string;
  @Prop({ required: true }) session: string;
  @Prop({ required: true }) contactNumber: string;
  @Prop({ required: true, lowercase: true }) email: string;
  @Prop({ required: true }) currentProfession: string;
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
