import { IsString } from 'class-validator';

export class CreateAcademicLevelDto {
  @IsString()
  level: string;
}
