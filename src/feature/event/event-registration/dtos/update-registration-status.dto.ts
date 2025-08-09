import { IsEnum } from 'class-validator';
import { EventRegistrationStatus } from '../event-registration-status';

export class UpdateRegistrationStatusDto {
  @IsEnum(EventRegistrationStatus)
  status: EventRegistrationStatus;
}
