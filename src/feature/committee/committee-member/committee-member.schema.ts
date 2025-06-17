import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Committee, CommitteeDocument } from '../committee/committee.schema';
import {
  CommitteeDesignation,
  CommitteeDesignationDocument,
} from '../committee-designation/committee-designation.schema';
import { UserDocument } from 'src/feature/user';
import { User } from '@auth0/auth0-spa-js';

@Schema({
  timestamps: true,
  collection: 'committee_members',
})
export class CommitteeMember {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Committee.name,
    autopopulate: true,
  })
  committee: mongoose.Schema.Types.ObjectId | CommitteeDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: CommitteeDesignation.name,
    autopopulate: true,
  })
  designation: mongoose.Schema.Types.ObjectId | CommitteeDesignationDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  member: mongoose.Schema.Types.ObjectId | UserDocument;
}

export const CommitteeMemberSchema =
  SchemaFactory.createForClass(CommitteeMember);
CommitteeMemberSchema.plugin(require('mongoose-autopopulate'));

export type CommitteeMemberDocument = HydratedDocument<CommitteeMember>;
