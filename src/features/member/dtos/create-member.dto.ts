import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMongoId()
  @IsNotEmpty()
  batch: string;

  @IsMongoId()
  @IsNotEmpty()
  shift: string;

  @IsUrl()
  photo: string;
}
