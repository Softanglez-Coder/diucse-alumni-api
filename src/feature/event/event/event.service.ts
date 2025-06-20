import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { EventDocument } from './event.schema';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService extends BaseService<EventDocument> {
  constructor(private readonly eventRepository: EventRepository) {
    super(eventRepository);
  }
}
