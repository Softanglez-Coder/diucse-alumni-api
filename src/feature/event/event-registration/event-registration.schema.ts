import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserDocument } from '../../user';
import { EventRegistrationStatus } from './event-registration-status';
import { Invoice, InvoiceDocument } from '../../invoice';
import {
  EventCoupon,
  EventCouponDocument,
} from '../event-coupon/event-coupon.schema';
import { EventDocument, Event } from '../event';

@Schema({
  timestamps: true,
  collection: 'event_registrations',
})
export class EventRegistration {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    autopopulate: true,
  })
  event: mongoose.Schema.Types.ObjectId | EventDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  guest: mongoose.Schema.Types.ObjectId | UserDocument;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(EventRegistrationStatus),
    default: EventRegistrationStatus.Waitlisted,
  })
  status?: EventRegistrationStatus;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Invoice.name,
    autopopulate: true,
  })
  invoice?: mongoose.Schema.Types.ObjectId | InvoiceDocument;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: EventCoupon.name,
    autopopulate: true,
  })
  coupon?: mongoose.Schema.Types.ObjectId | EventCouponDocument;
}

export const EventRegistrationSchema =
  SchemaFactory.createForClass(EventRegistration);
EventRegistrationSchema.plugin(require('mongoose-autopopulate'));

export type EventRegistrationDocument = HydratedDocument<EventRegistration>;
