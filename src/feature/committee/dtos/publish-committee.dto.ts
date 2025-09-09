import { IsBoolean } from 'class-validator';

export class PublishCommitteeDto {
  @IsBoolean()
  isPublished: boolean;
}
