import { IsString, IsNotEmpty } from 'class-validator';
export class EntityRefDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
