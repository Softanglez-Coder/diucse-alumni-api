import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateBannerDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsUrl()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    link?: string;
}