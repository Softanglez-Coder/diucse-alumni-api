import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Designation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export type DesignationDocument = Designation & Document;

export const DesignationSchema = SchemaFactory.createForClass(Designation);
