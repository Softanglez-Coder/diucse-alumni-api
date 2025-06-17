import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Committee, CommitteeDocument } from '../committee/committee.schema';
import {
  CommitteeDesignation,
  CommitteeDesignationDocument,
} from '../committee-designation/committee-designation.schema';
import { Member, MemberDocument } from '../../member/member.schema';

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
    ref: Member.name,
    autopopulate: true,
  })
  member: mongoose.Schema.Types.ObjectId | MemberDocument;
}

export const CommitteeMemberSchema =
  SchemaFactory.createForClass(CommitteeMember);
CommitteeMemberSchema.plugin(require('mongoose-autopopulate'));

export type CommitteeMemberDocument = HydratedDocument<CommitteeMember>;
