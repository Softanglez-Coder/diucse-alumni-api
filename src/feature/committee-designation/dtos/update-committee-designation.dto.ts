import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Role } from '@core';

export class UpdateCommitteeDesignationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
