import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentRemarks, PaymentStatus } from './enums';

@Schema({
  timestamps: true,
})
export class Payment {
  @Prop({
    required: true,
    type: String,
    unique: true,
    index: true,
    trim: true,
    immutable: true,
  })
  trxId: string;

  @Prop({
    required: true,
    type: Number,
    min: 0,
  })
  amount: number;

  @Prop({
    required: true,
    type: Number,
    min: 0,
    default: 0,
  })
  depositAmount: number;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(PaymentRemarks),
  })
  remarks: string;

  @Prop({
    type: String,
    trim: true,
    default: null,
  })
  referenceId?: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: string;

  @Prop({
    type: String,
    required: true,
  })
  cardNo: string;

  @Prop({
    type: String,
    required: true,
  })
  cardIssuer: string;

  @Prop({
    type: String,
    required: true,
  })
  cardBrand: string;

  @Prop({
    type: String,
    default: null,
    trim: true,
  })
  bankTrxId?: string;

  @Prop({
    type: String,
    default: null,
    trim: true,
  })
  cardType?: string;

  @Prop({
    type: String,
    default: null,
    unique: true,
    trim: true,
  })
  validationId?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.plugin(require('mongoose-autopopulate'));
export type PaymentDocument = HydratedDocument<Payment>;
