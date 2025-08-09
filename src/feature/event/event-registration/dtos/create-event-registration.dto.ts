import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateEventRegistrationDto {
  @IsMongoId()
  event: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  guest: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  coupon?: mongoose.Schema.Types.ObjectId;
}
