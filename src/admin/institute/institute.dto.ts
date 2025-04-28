import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateInstituteDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
