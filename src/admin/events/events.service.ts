import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache, // Redis cache inject
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    const saved = await createdEvent.save();

    // Invalidate cache
    await this.cacheManager.del('events:all');

    return saved;
  }

  async findAll(): Promise<Event[]> {
    const cacheKey = 'events:all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Event[];
    }

    const events = await this.eventModel.find().exec();
    await this.cacheManager.set(cacheKey, events, 120); // TTL 2 minutes

    return events;
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateDto: UpdateEventDto): Promise<Event> {
    const updated = await this.eventModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Invalidate cache
    await this.cacheManager.del('events:all');

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Invalidate cache
    await this.cacheManager.del('events:all');
  }
}
