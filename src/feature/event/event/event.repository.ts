import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Event, EventDocument } from './event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventRepository extends BaseRepository<EventDocument> {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {
    super(eventModel);
  }
}
