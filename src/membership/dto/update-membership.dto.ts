import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityRefDto } from './entity-ref.dto';

export class UpdateMembershipDto {
  @IsOptional()
  @IsString()
  @Length(5, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  mobileNo?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityRefDto)
  currentCountry?: EntityRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityRefDto)
  profession?: EntityRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityRefDto)
  institute?: EntityRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityRefDto)
  designation?: EntityRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityRefDto)
  lastAcademicLevel?: EntityRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityRefDto)
  lastPassingYear?: EntityRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EntityRefDto)
  lastBatch?: EntityRefDto;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  paymentTransactionId?: string;
}
