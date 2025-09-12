import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateCommitteeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
