import { BaseController, Roles, Role } from '@core';
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventCouponDocument } from './event-coupon.schema';
import { EventCouponService } from './event-coupon.service';
import {
  CreateEventCouponDto,
  UpdateEventCouponDto,
  ValidateCouponDto,
} from './dtos';
import { Request } from 'express';

@Controller('event-coupons')
export class EventCouponController extends BaseController<EventCouponDocument> {
  constructor(private readonly eventCouponService: EventCouponService) {
    super(eventCouponService);
  }

  @Roles(Role.EventManager)
  @Post()
  async create(@Body() createEventCouponDto: CreateEventCouponDto) {
    return this.eventCouponService.createCoupon(createEventCouponDto);
  }

  @Roles(Role.EventManager)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventCouponDto: UpdateEventCouponDto,
  ) {
    return this.eventCouponService.updateCoupon(id, updateEventCouponDto);
  }

  @Roles(Role.EventManager)
  @Post(':eventId/validate')
  @HttpCode(HttpStatus.OK)
  async validateCoupon(
    @Param('eventId') eventId: string,
    @Body() validateCouponDto: ValidateCouponDto,
  ) {
    return this.eventCouponService.validateCoupon(
      eventId,
      validateCouponDto.code,
    );
  }

  @Roles(Role.EventManager)
  @Patch(':id/use')
  @HttpCode(HttpStatus.OK)
  async useCoupon(@Param('id') id: string) {
    return this.eventCouponService.useCoupon(id);
  }

  @Roles(Role.EventManager)
  @Get('event/:eventId')
  async getEventCoupons(
    @Param('eventId') eventId: string,
    @Req() req: Request,
  ) {
    return this.eventCouponService.getEventCoupons(eventId, req);
  }

  @Roles(Role.EventManager)
  @Get('event/:eventId/available')
  async getAvailableCoupons(
    @Param('eventId') eventId: string,
    @Req() req: Request,
  ) {
    return this.eventCouponService.getAvailableCoupons(eventId, req);
  }
}
