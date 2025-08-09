import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UnpublishEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  justification?: string;
}
