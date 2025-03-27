import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  @Length(5, 50)
  name: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  mobileNo: string;

  @IsEmail()
  email: string;

  @IsString()
  currentCountry: string;

  @IsString()
  profession: string;

  @IsString()
  professionalInstitute: string;

  @IsString()
  designation: string;

  @IsString()
  lastAcademicLevel: string;

  @IsNotEmpty()
  lastPassingYear: number;

  @IsString()
  lastBatch: string;

  @IsString()
  @IsNotEmpty()
  paymentTransactionId: string;
}
