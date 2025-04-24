import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateCommitteeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  officeStartDate: string;

  @IsNotEmpty()
  @IsDateString()
  officeEndDate: string;
}
