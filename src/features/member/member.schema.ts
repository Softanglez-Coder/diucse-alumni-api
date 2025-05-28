import { Batch, BatchDocument } from '@batch';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Shift, ShiftDocument } from '@shift';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Member {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  phone: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Batch.name,
    required: true,
    autopopulate: true,
  })
  batch: BatchDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Shift.name,
    required: true,
    autopopulate: true,
  })
  shift: ShiftDocument;

  @Prop({
    type: String,
    required: true,
  })
  photo: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.plugin(require('mongoose-autopopulate'));

export type MemberDocument = HydratedDocument<Member>;
