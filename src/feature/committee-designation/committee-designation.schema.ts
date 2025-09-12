import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '@core';

@Schema({
  timestamps: true,
  collection: 'committee_designations',
})
export class CommitteeDesignation {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: false,
  })
  description?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Committee',
    required: true,
  })
  committeeId: Types.ObjectId;

  @Prop({
    type: [String],
    enum: Role,
    default: [Role.Member],
  })
  roles: Role[];

  @Prop({
    type: Number,
    default: 0,
  })
  displayOrder: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const CommitteeDesignationSchema = SchemaFactory.createForClass(CommitteeDesignation);
export type CommitteeDesignationDocument = HydratedDocument<CommitteeDesignation>;
