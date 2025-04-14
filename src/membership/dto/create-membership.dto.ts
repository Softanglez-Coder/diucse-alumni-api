import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityRefDto } from './entity-ref.dto';

export class CreateMembershipDto {
  @IsString()
  @Length(5, 50)
  name: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  mobileNo: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => EntityRefDto)
  currentCountry: EntityRefDto;

  @ValidateNested()
  @Type(() => EntityRefDto)
  profession: EntityRefDto;

  @ValidateNested()
  @Type(() => EntityRefDto)
  institute: EntityRefDto;

  @ValidateNested()
  @Type(() => EntityRefDto)
  designation: EntityRefDto;

  @ValidateNested()
  @Type(() => EntityRefDto)
  lastAcademicLevel: EntityRefDto;

  @ValidateNested()
  @Type(() => EntityRefDto)
  lastPassingYear: EntityRefDto;

  @ValidateNested()
  @Type(() => EntityRefDto)
  lastBatch: EntityRefDto;

  @IsString()
  @IsNotEmpty()
  paymentTransactionId: string;
}

