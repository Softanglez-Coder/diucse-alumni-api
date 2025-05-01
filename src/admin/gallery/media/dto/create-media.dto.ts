import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsMongoId()
  album?: string;
}
