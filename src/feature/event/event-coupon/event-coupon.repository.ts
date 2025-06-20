import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { EventCoupon, EventCouponDocument } from './event-coupon.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventCouponRepository extends BaseRepository<EventCouponDocument> {
  constructor(
    @InjectModel(EventCoupon.name)
    private readonly eventCouponModel: Model<EventCouponDocument>,
  ) {
    super(eventCouponModel);
  }
}
