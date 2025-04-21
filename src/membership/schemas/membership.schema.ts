import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MembershipStatus } from '../enums/membership-status.enum';
import { IsEnum } from 'class-validator';

@Schema({ collection: 'memberships' })
export class Membership extends Document {
  @Prop({ required: true, minlength: 5, maxlength: 50 })
  name: string;

  @Prop({ required: true, unique: true })
  mobileNo: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: {
      id: String,
      name: String,
    },
    required: true,
  })
  currentCountry: {
    id: string;
    name: string;
  };

  @Prop({
    type: {
      id: String,
      name: String,
    },
  })
  profession: {
    id: string;
    name: string;
  };

  @Prop({
    type: {
      id: String,
      name: String,
    },
  })
  institute: {
    id: string;
    name: string;
  };

  @Prop({
    type: {
      id: String,
      name: String,
    },
  })
  designation: {
    id: string;
    name: string;
  };

  @Prop({
    type: {
      id: String,
      name: String,
    },
  })
  lastAcademicLevel: {
    id: string;
    name: string;
  };

  @Prop({
    type: {
      id: String,
      year: Number,
    },
  })
  lastBatch: {
    id: string;
    year: number;
  };

  @Prop()
  lastPassingYear: number;

  @Prop({ required: true })
  paymentTransactionId: string;

  @Prop({
    type: String,
    enum: MembershipStatus,
    default: MembershipStatus.Pending,
  })
  @IsEnum(MembershipStatus)
  status: MembershipStatus;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
