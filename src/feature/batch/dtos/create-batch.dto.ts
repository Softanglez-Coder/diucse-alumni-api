import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1990)
  @Max(new Date().getFullYear() + 10) // Allowing up to 10 years in the future
  passingYear: number;
}
