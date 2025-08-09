import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Roles, Role, Public, BaseController } from '@core';
import { EventDocument } from './event.schema';
import {
  CreateEventDto,
  UpdateEventDto,
  CloseRegistrationDto,
  UnpublishEventDto,
} from './dtos';
import { Request } from 'express';

@Controller('events')
export class EventController extends BaseController<EventDocument> {
  constructor(private readonly eventService: EventService) {
    super(eventService);
  }

  @Roles(Role.EventManager)
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Public()
  @Get('published')
  async getPublished(@Req() req: Request) {
    return this.eventService.getPublishedEvents(req);
  }

  @Public()
  @Get('upcoming')
  async getUpcoming(@Req() req: Request) {
    return this.eventService.getUpcomingEvents(req);
  }

  @Public()
  @Get('past')
  async getPast(@Req() req: Request) {
    return this.eventService.getPastEvents(req);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Roles(Role.EventManager)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Roles(Role.EventManager)
  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string) {
    return this.eventService.publishEvent(id);
  }

  @Roles(Role.EventManager)
  @Patch(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(
    @Param('id') id: string,
    @Body() unpublishEventDto: UnpublishEventDto,
  ) {
    return this.eventService.unpublishEvent(
      id,
      unpublishEventDto.justification,
    );
  }

  @Roles(Role.EventManager)
  @Patch(':id/registration/open')
  @HttpCode(HttpStatus.OK)
  async openRegistration(@Param('id') id: string) {
    return this.eventService.openEventRegistration(id);
  }

  @Roles(Role.EventManager)
  @Patch(':id/registration/close')
  @HttpCode(HttpStatus.OK)
  async closeRegistration(
    @Param('id') id: string,
    @Body() closeRegistrationDto: CloseRegistrationDto,
  ) {
    return this.eventService.closeEventRegistration(
      id,
      closeRegistrationDto.justification,
    );
  }
}
