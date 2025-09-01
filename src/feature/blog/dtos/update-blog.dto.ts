import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogStatus } from '../blog.schema';

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;
}
