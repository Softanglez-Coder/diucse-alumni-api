import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserDocument } from '../user';
import { MembershipStatus } from './membership-status';
import { Invoice, InvoiceDocument } from '../invoice';

@Schema({
  timestamps: true,
  collection: 'memberships',
})
export class Membership {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: UserDocument | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MembershipStatus),
    default: MembershipStatus.Draft,
  })
  status?: MembershipStatus;

  @Prop({
    type: String,
    default: null,
  })
  justification?: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Invoice.name,
    autopopulate: true,
  })
  invoice?: InvoiceDocument | mongoose.Schema.Types.ObjectId;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.plugin(require('mongoose-autopopulate'));
export type MembershipDocument = HydratedDocument<Membership>;
