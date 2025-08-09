import { BaseController, Roles, Role, Public } from '@core';
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
import { EventRegistrationDocument } from './event-registration.schema';
import { EventRegistrationService } from './event-registration.service';
import {
  CreateEventRegistrationDto,
  UpdateRegistrationStatusDto,
} from './dtos';
import { Request } from 'express';

@Controller('event-registrations')
export class EventRegistrationController extends BaseController<EventRegistrationDocument> {
  constructor(
    private readonly eventRegistrationService: EventRegistrationService,
  ) {
    super(eventRegistrationService);
  }

  @Public()
  @Post()
  async register(
    @Body() createEventRegistrationDto: CreateEventRegistrationDto,
  ) {
    return this.eventRegistrationService.registerForEvent(
      createEventRegistrationDto,
    );
  }

  @Roles(Role.EventManager)
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateRegistrationStatusDto,
  ) {
    return this.eventRegistrationService.updateRegistrationStatus(
      id,
      updateStatusDto.status,
    );
  }

  @Roles(Role.EventManager)
  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('id') id: string) {
    return this.eventRegistrationService.confirmRegistration(id);
  }

  @Roles(Role.EventManager)
  @Patch(':id/waitlist')
  @HttpCode(HttpStatus.OK)
  async waitlist(@Param('id') id: string) {
    return this.eventRegistrationService.waitlistRegistration(id);
  }

  @Public()
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string) {
    return this.eventRegistrationService.cancelRegistration(id);
  }

  @Roles(Role.EventManager)
  @Get('event/:eventId')
  async getEventRegistrations(
    @Param('eventId') eventId: string,
    @Req() req: Request,
  ) {
    return this.eventRegistrationService.getEventRegistrations(eventId, req);
  }

  @Public()
  @Get('user/:userId')
  async getUserRegistrations(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    return this.eventRegistrationService.getUserRegistrations(userId, req);
  }
}
