import { IsInt, Min } from 'class-validator';

export class CreatePassingYearDto {
  @IsInt()
  @Min(2000)
  year: number;
}
