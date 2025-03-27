import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  professionalInstitute: string;

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
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string; 
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
