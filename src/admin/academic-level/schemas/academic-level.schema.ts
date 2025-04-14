import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class AcademicLevel {
  @Prop()
  name: string;

}
export type AcademicLevelDocument = AcademicLevel & Document;
export const AcademicLevelSchema = SchemaFactory.createForClass(AcademicLevel);