import { IsString, IsDateString } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
