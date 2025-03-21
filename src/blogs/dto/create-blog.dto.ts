import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Author {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @ValidateNested()
  @Type(() => Author)
  author: Author;
}
