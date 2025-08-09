import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EventSchema,
  Event,
  EventController,
  EventService,
  EventRepository,
} from './event';
import {
  EventCoupon,
  EventCouponController,
  EventCouponRepository,
  EventCouponSchema,
  EventCouponService,
} from './event-coupon';
import {
  EventRegistration,
  EventRegistrationController,
  EventRegistrationRepository,
  EventRegistrationSchema,
  EventRegistrationService,
} from './event-registration';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: EventRegistration.name,
        schema: EventRegistrationSchema,
      },
      {
        name: EventCoupon.name,
        schema: EventCouponSchema,
      },
    ]),
  ],
  providers: [
    EventService,
    EventRepository,

    EventCouponService,
    EventCouponRepository,

    EventRegistrationService,
    EventRegistrationRepository,
  ],
  controllers: [
    EventController,
    EventCouponController,
    EventRegistrationController,
  ],
  exports: [EventService], // Export EventService to be used by other modules
})
export class EventModule {}
