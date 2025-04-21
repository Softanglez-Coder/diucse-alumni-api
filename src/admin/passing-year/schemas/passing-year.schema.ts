import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PassingYearDocument = PassingYear & Document;

@Schema()
export class PassingYear {
  @Prop({ required: true })
  year: number;
}

export const PassingYearSchema = SchemaFactory.createForClass(PassingYear);
