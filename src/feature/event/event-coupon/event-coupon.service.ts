import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { EventCouponDocument } from './event-coupon.schema';
import { EventCouponRepository } from './event-coupon.repository';

@Injectable()
export class EventCouponService extends BaseService<EventCouponDocument> {
  constructor(private readonly eventCouponRepository: EventCouponRepository) {
    super(eventCouponRepository);
  }
}
