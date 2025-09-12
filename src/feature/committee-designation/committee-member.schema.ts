import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'committee_members',
})
export class CommitteeMember {
  @Prop({
    type: Types.ObjectId,
    ref: 'Committee',
    required: true,
  })
  committeeId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'CommitteeDesignation',
    required: true,
  })
  designationId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  assignedDate: Date;

  @Prop({
    type: Date,
    required: false,
  })
  unassignedDate?: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: String,
    required: false,
  })
  notes?: string;
}

export const CommitteeMemberSchema = SchemaFactory.createForClass(CommitteeMember);

// Ensure a user can only have one active designation per committee
CommitteeMemberSchema.index(
  { committeeId: 1, userId: 1, isActive: 1 },
  { 
    unique: true,
    partialFilterExpression: { isActive: true }
  }
);

// Ensure a designation can only have one active member per committee (if needed)
CommitteeMemberSchema.index(
  { committeeId: 1, designationId: 1, isActive: 1 },
  { 
    unique: true,
    partialFilterExpression: { isActive: true }
  }
);

export type CommitteeMemberDocument = HydratedDocument<CommitteeMember>;
