import { Optional } from '@nestjs/common';
import { IsMongoId, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateUserDto {
  @IsString()
  @Optional()
  name?: string;

  @IsString()
  @Optional()
  email?: string;

  @IsString()
  @Optional()
  phone?: string;

  @IsMongoId()
  @Optional()
  batch: mongoose.Schema.Types.ObjectId;

  @IsString()
  @Optional()
  currentPosition?: string;

  @IsString()
  @Optional()
  company?: string;
}
