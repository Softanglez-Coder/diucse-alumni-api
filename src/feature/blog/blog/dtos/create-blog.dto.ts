import { IsEnum, IsString } from "class-validator";
import { BlogType } from "../blog-type";

export class CreateBlogDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsEnum(BlogType)
    type: BlogType;
}