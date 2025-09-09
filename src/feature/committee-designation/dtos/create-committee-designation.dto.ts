import { IsString, IsArray, IsOptional, IsMongoId, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '@core';

export class CreateCommitteeDesignationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  committeeId: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
