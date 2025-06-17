import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './event.schema';
import { EventRegistration, EventRegistrationSchema } from './event-registration.schema';
import { EventCoupon, EventCouponSchema } from './event-coupon.schema';

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
        schema: EventCouponSchema
      }
    ])
  ],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
