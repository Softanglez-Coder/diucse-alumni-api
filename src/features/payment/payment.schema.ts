import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentRemarks, PaymentStatus } from './enums';

@Schema({
  timestamps: true,
})
export class Payment {
  @Prop({
    type: String,
  })
  trxId?: string;

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
  status: PaymentStatus;

  @Prop({
    type: String,
    trim: true,
    default: null,
  })
  method?: string;

  @Prop({
    type: String,
    trim: true,
    default: null,
  })
  invoiceId?: string;

  @Prop({
    type: String,
    default: null
  })
  currency?: string;

  @Prop({
    type: String,
    default: null
  })
  bankTransactionId?: string;

  @Prop({
    type: String,
    default: null
  })
  productId?: string;

  @Prop({
    type: String,
    default: null
  })
  sender?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.plugin(require('mongoose-autopopulate'));
export type PaymentDocument = HydratedDocument<Payment>;
