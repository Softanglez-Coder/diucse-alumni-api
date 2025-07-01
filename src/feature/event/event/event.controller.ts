import {
  Controller,
  Get,
  NotImplementedException,
  Patch,
  Post,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Roles, Role, Public, BaseController } from '@core';
import { EventDocument } from './event.schema';

@Controller('events')
export class EventController extends BaseController<EventDocument> {
  constructor(private readonly eventService: EventService) {
    super(eventService);
  }

  @Roles(Role.EventManager)
  @Post()
  async create() {
    throw new NotImplementedException('Method not implemented');
  }

  @Public()
  @Get(':id')
  async findOne() {
    throw new NotImplementedException('Method not implemented');
  }

  @Roles(Role.EventManager)
  @Patch(':id')
  async update() {
    throw new NotImplementedException('Method not implemented');
  }

  @Roles(Role.EventManager)
  @Patch(':id/publish')
  async publish() {
    throw new NotImplementedException('Method not implemented');
  }

  @Roles(Role.EventManager)
  @Patch(':id/unpublish')
  async unpublish() {
    throw new NotImplementedException('Method not implemented');
  }
}
