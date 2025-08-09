import { BaseService } from '@core';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EventRegistrationDocument } from './event-registration.schema';
import { EventRegistrationRepository } from './event-resigtration.repository';
import { CreateEventRegistrationDto } from './dtos/create-event-registration.dto';
import { EventRegistrationStatus } from './event-registration-status';
import { EventService } from '../event/event.service';

@Injectable()
export class EventRegistrationService extends BaseService<EventRegistrationDocument> {
  constructor(
    private readonly eventRegistrationRepository: EventRegistrationRepository,
    private readonly eventService: EventService,
  ) {
    super(eventRegistrationRepository);
  }

  async registerForEvent(
    createEventRegistrationDto: CreateEventRegistrationDto,
  ): Promise<EventRegistrationDocument> {
    const {
      event: eventId,
      guest: guestId,
      coupon,
    } = createEventRegistrationDto;

    // Check if event exists and is open for registration
    const event = await this.eventService.findById(eventId.toString());
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.published) {
      throw new BadRequestException('Event is not published');
    }

    if (!event.open) {
      throw new BadRequestException('Event registration is closed');
    }

    // Check if user is already registered for this event
    const existingRegistration = await this.eventRegistrationRepository
      .getModel()
      .findOne({ event: eventId, guest: guestId });

    if (existingRegistration) {
      throw new ConflictException('User is already registered for this event');
    }

    // Check event capacity
    const currentRegistrations = await this.eventRegistrationRepository
      .getModel()
      .countDocuments({
        event: eventId,
        status: {
          $in: [
            EventRegistrationStatus.Confirmed,
            EventRegistrationStatus.Pending,
          ],
        },
      });

    let status = EventRegistrationStatus.Pending;
    if (event.capacity && currentRegistrations >= event.capacity) {
      status = EventRegistrationStatus.Waitlisted;
    }

    // Create registration
    const registration = await this.eventRegistrationRepository.create({
      event: eventId,
      guest: guestId,
      coupon,
      status,
    });

    return registration;
  }

  async updateRegistrationStatus(
    id: string,
    status: EventRegistrationStatus,
  ): Promise<EventRegistrationDocument> {
    const registration = await this.eventRegistrationRepository.findById(id);
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    const updatedRegistration = await this.eventRegistrationRepository.update(
      id,
      {
        status,
      },
    );

    return updatedRegistration;
  }

  async cancelRegistration(id: string): Promise<EventRegistrationDocument> {
    const registration = await this.eventRegistrationRepository.findById(id);
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.status === EventRegistrationStatus.Cancelled) {
      throw new BadRequestException('Registration is already cancelled');
    }

    const updatedRegistration = await this.eventRegistrationRepository.update(
      id,
      {
        status: EventRegistrationStatus.Cancelled,
      },
    );

    return updatedRegistration;
  }

  async getEventRegistrations(eventId: string, req: any): Promise<any> {
    const options = { filter: { event: eventId } };
    return this.findAll(options, req);
  }

  async getUserRegistrations(userId: string, req: any): Promise<any> {
    const options = { filter: { guest: userId } };
    return this.findAll(options, req);
  }

  async confirmRegistration(id: string): Promise<EventRegistrationDocument> {
    return this.updateRegistrationStatus(id, EventRegistrationStatus.Confirmed);
  }

  async waitlistRegistration(id: string): Promise<EventRegistrationDocument> {
    return this.updateRegistrationStatus(
      id,
      EventRegistrationStatus.Waitlisted,
    );
  }
}
