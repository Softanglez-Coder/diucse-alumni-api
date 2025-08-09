import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CloseRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  justification: string;
}
