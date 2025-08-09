import { IsString, MinLength, MaxLength } from 'class-validator';

export class ValidateCouponDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code: string;
}
