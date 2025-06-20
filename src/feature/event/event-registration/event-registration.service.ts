import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { EventRegistrationDocument } from './event-registration.schema';
import { EventRegistrationRepository } from './event-resigtration.repository';

@Injectable()
export class EventRegistrationService extends BaseService<EventRegistrationDocument> {
  constructor(
    private readonly eventRegistrationRepository: EventRegistrationRepository,
  ) {
    super(eventRegistrationRepository);
  }
}
