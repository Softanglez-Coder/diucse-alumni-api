import { BaseService } from '@core';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EventCouponDocument } from './event-coupon.schema';
import { EventCouponRepository } from './event-coupon.repository';
import { CreateEventCouponDto } from './dtos/create-event-coupon.dto';
import { UpdateEventCouponDto } from './dtos/update-event-coupon.dto';

@Injectable()
export class EventCouponService extends BaseService<EventCouponDocument> {
  constructor(private readonly eventCouponRepository: EventCouponRepository) {
    super(eventCouponRepository);
  }

  async createCoupon(
    createEventCouponDto: CreateEventCouponDto,
  ): Promise<EventCouponDocument> {
    // Check if coupon code already exists
    const existingCoupon = await this.eventCouponRepository
      .getModel()
      .findOne({ code: createEventCouponDto.code });

    if (existingCoupon) {
      throw new ConflictException('Coupon code already exists');
    }

    const coupon = await this.eventCouponRepository.create({
      ...createEventCouponDto,
      used: 0,
    });

    return coupon;
  }

  async updateCoupon(
    id: string,
    updateEventCouponDto: UpdateEventCouponDto,
  ): Promise<EventCouponDocument> {
    const coupon = await this.eventCouponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    // If updating code, check for uniqueness
    if (updateEventCouponDto.code) {
      const existingCoupon = await this.eventCouponRepository
        .getModel()
        .findOne({
          code: updateEventCouponDto.code,
          _id: { $ne: id },
        });

      if (existingCoupon) {
        throw new ConflictException('Coupon code already exists');
      }
    }

    const updatedCoupon = await this.eventCouponRepository.update(
      id,
      updateEventCouponDto,
    );

    return updatedCoupon;
  }

  async validateCoupon(
    eventId: string,
    code: string,
  ): Promise<EventCouponDocument> {
    const coupon = await this.eventCouponRepository.getModel().findOne({
      event: eventId,
      code: code,
    });

    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (coupon.used >= coupon.quantity) {
      throw new BadRequestException('Coupon has been fully used');
    }

    return coupon;
  }

  async useCoupon(id: string): Promise<EventCouponDocument> {
    const coupon = await this.eventCouponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (coupon.used >= coupon.quantity) {
      throw new BadRequestException('Coupon has been fully used');
    }

    const updatedCoupon = await this.eventCouponRepository.update(id, {
      used: coupon.used + 1,
    });

    return updatedCoupon;
  }

  async getEventCoupons(eventId: string, req: any): Promise<any> {
    const options = { filter: { event: eventId } };
    return this.findAll(options, req);
  }

  async getAvailableCoupons(eventId: string, req: any): Promise<any> {
    const options = {
      filter: {
        event: eventId,
        $expr: { $lt: ['$used', '$quantity'] },
      },
    };
    return this.findAll(options, req);
  }
}
