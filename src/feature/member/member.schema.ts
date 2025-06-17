import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  Membership,
  MembershipDocument,
} from '../membership/membership.schema';

@Schema({
  timestamps: true,
  collection: 'members',
})
export class Member {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Membership.name,
    required: true,
    index: true,
    autopopulate: true,
  })
  membership: mongoose.Schema.Types.ObjectId | MembershipDocument;

  // company

  // education

  // social media links

  // misc
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.plugin(require('mongoose-autopopulate'));
export type MemberDocument = HydratedDocument<Member>;
