import { Optional } from '@nestjs/common';
import { IsDateString, IsString } from 'class-validator';

export class CreateCommitteeDto {
  @IsString()
  name: string;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}

export class UpdateCommitteeDto {
  @IsString()
  @Optional()
  name?: string;

  @IsDateString()
  @Optional()
  start?: string;

  @IsDateString()
  @Optional()
  end?: string;
}
