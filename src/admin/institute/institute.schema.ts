import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstituteDocument = Institute & Document;

@Schema()
export class Institute {
  @Prop({ required: true, unique: true })
  name: string;
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);
