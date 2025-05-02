import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDateString,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class MediaRefDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  url: string;
}

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  mapUrl?: string;

  @IsBoolean()
  isOnline: boolean;

  @ValidateIf((o) => o.isOnline === true)
  @IsString({ message: 'onlineUrl is required when event is online' })
  onlineUrl?: string;

  @IsOptional()
  @IsNumber()
  fee?: number;

  @IsOptional()
  @IsDateString()
  registrationStartDate?: string;

  @IsOptional()
  @IsDateString()
  registrationEndDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaRefDto)
  poster?: MediaRefDto;
}
