import { BaseService } from '@core';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventDocument } from './event.schema';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Injectable()
export class EventService extends BaseService<EventDocument> {
  constructor(private readonly eventRepository: EventRepository) {
    super(eventRepository);
  }

  async createEvent(createEventDto: CreateEventDto): Promise<EventDocument> {
    // Validate dates
    const startDate = new Date(createEventDto.start);
    const endDate = new Date(createEventDto.end);

    if (startDate >= endDate) {
      throw new BadRequestException('Event start date must be before end date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Event start date cannot be in the past');
    }

    const event = await this.eventRepository.create(createEventDto);
    return event;
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventDocument> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Validate dates if they are being updated
    if (updateEventDto.start || updateEventDto.end) {
      const startDate = new Date(updateEventDto.start || event.start);
      const endDate = new Date(updateEventDto.end || event.end);

      if (startDate >= endDate) {
        throw new BadRequestException(
          'Event start date must be before end date',
        );
      }
    }

    const updatedEvent = await this.eventRepository.update(id, updateEventDto);
    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    return updatedEvent;
  }

  async publishEvent(id: string): Promise<EventDocument> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.published) {
      throw new BadRequestException('Event is already published');
    }

    const updatedEvent = await this.eventRepository.update(id, {
      published: true,
      open: true,
    });

    return updatedEvent;
  }

  async unpublishEvent(
    id: string,
    justification?: string,
  ): Promise<EventDocument> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.published) {
      throw new BadRequestException('Event is already unpublished');
    }

    const updatedEvent = await this.eventRepository.update(id, {
      published: false,
      open: false,
      justificationOfClosing: justification,
    });

    return updatedEvent;
  }

  async getPublishedEvents(req: any): Promise<any> {
    const options = { filter: { published: true } };
    return this.findAll(options, req);
  }

  async getUpcomingEvents(req: any): Promise<any> {
    const now = new Date().toISOString();
    const options = {
      filter: {
        published: true,
        start: { $gte: now },
      },
    };
    return this.findAll(options, req);
  }

  async getPastEvents(req: any): Promise<any> {
    const now = new Date().toISOString();
    const options = {
      filter: {
        published: true,
        end: { $lt: now },
      },
    };
    return this.findAll(options, req);
  }

  async openEventRegistration(id: string): Promise<EventDocument> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.published) {
      throw new BadRequestException(
        'Cannot open registration for unpublished event',
      );
    }

    const updatedEvent = await this.eventRepository.update(id, {
      open: true,
      justificationOfClosing: undefined,
    });

    return updatedEvent;
  }

  async closeEventRegistration(
    id: string,
    justification: string,
  ): Promise<EventDocument> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!justification || justification.trim().length === 0) {
      throw new BadRequestException(
        'Justification is required when closing event registration',
      );
    }

    const updatedEvent = await this.eventRepository.update(id, {
      open: false,
      justificationOfClosing: justification,
    });

    return updatedEvent;
  }
}
