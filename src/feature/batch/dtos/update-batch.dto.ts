import { IsString } from 'class-validator';

export class UpdateBatchDto {
  @IsString()
  name: string;
}
