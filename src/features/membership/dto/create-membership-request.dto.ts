import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsUrl,
  IsMongoId,
} from 'class-validator';

export class MembershipRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phone: string;

  @IsUrl()
  photo: string;

  @IsMongoId()
  batch: string;

  @IsMongoId()
  shift: string;
}
