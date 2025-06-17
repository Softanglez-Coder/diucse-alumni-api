import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from '../invoice';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaymentStatus } from './payment-status';

@Schema({
  timestamps: true,
  collection: 'payments',
})
export class Payment {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Invoice.name,
    autopopulate: true,
  })
  invoice: InvoiceDocument | mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.Pending,
  })
  status: PaymentStatus;

  @Prop({
    type: String,
    default: null,
  })
  method: string;

  @Prop({
    type: String,
    default: null,
  })
  sender: string;

  @Prop({
    type: String,
    default: null,
  })
  trxId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.plugin(require('mongoose-autopopulate'));
export type PaymentDocument = HydratedDocument<Payment>;
