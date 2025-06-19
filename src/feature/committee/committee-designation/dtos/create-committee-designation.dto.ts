import { Role } from '@core';
import { IsEnum, IsString } from 'class-validator';

export class CreateCommitteeDesignationDto {
  @IsString()
  title: string;

  @IsEnum(Role, {
    each: true,
  })
  roles: Role[];
}
