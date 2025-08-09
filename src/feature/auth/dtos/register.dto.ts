import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s\-()]{10,20}$/, {
    message:
      'Phone number must be a valid format (10-20 digits with optional +, spaces, -, ())',
  })
  phone?: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @IsOptional()
  @IsMongoId()
  batch?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  currentPosition?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;
}
