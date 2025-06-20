import { BaseController } from '@core';
import { Controller } from '@nestjs/common';
import { EventCouponDocument } from './event-coupon.schema';
import { EventCouponService } from './event-coupon.service';

@Controller('event-coupon')
export class EventCouponController extends BaseController<EventCouponDocument> {
  constructor(private readonly eventCouponService: EventCouponService) {
    super(eventCouponService);
  }
}
