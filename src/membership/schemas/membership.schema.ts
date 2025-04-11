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

  @Prop({ required: true })
  currentCountry: string;

  @Prop()
  profession: string;

  @Prop()
  institute: string;

  @Prop()
  designation: string;

  @Prop()
  lastAcademicLevel: string;

  @Prop()
  lastPassingYear: number;

  @Prop()
  lastBatch: string;

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
