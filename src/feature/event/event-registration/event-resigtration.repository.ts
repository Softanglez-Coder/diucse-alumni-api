import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import {
  EventRegistration,
  EventRegistrationDocument,
} from './event-registration.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventRegistrationRepository extends BaseRepository<EventRegistrationDocument> {
  constructor(
    @InjectModel(EventRegistration.name)
    private readonly eventRegistrationModel: Model<EventRegistrationDocument>,
  ) {
    super(eventRegistrationModel);
  }
}
