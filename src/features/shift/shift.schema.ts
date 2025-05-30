import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Shift {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  name: string;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
export type ShiftDocument = HydratedDocument<Shift>;
