import { BaseController } from '@core';
import { Controller } from '@nestjs/common';
import { EventRegistrationDocument } from './event-registration.schema';
import { EventRegistrationService } from './event-registration.service';

@Controller('event-registrations')
export class EventRegistrationController extends BaseController<EventRegistrationDocument> {
  constructor(
    private readonly eventRegistrationService: EventRegistrationService,
  ) {
    super(eventRegistrationService);
  }
}
