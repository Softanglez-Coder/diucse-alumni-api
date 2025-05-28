import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Batch, BatchDocument } from '@batch';
import { Shift, ShiftDocument } from '@shift';
import { Payment, PaymentDocument } from '@payment';
import { MembershipRequestStatus } from './enums/membership-request-status';

@Schema({
  timestamps: true,
})
export class Membership {
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

  @Prop({
    type: String,
    enum: Object.values(MembershipRequestStatus),
    default: MembershipRequestStatus.PENDING,
  })
  status: MembershipRequestStatus;

  @Prop({
    type: String,
  })
  justification: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Payment.name,
    autopopulate: true,
  })
  payment: PaymentDocument;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.plugin(require('mongoose-autopopulate'));
export type MembershipDocument = HydratedDocument<Membership>;
