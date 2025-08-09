import {
  IsMongoId,
  IsNumber,
  IsString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateEventCouponDto {
  @IsMongoId()
  event: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code: string;
}
