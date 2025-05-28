import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsUrl,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class MembershipRequestUpdateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(15)
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsUrl()
  photo: string;

  @IsMongoId()
  @IsOptional()
  batch: string;

  @IsMongoId()
  @IsOptional()
  shift: string;
}
