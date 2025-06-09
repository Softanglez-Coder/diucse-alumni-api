import { IsMongoId, IsOptional, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import mongoose from "mongoose";

export class MembershipUpdateDto {
    @IsMongoId()
    @IsOptional()
    batch: mongoose.Schema.Types.ObjectId;

    @IsPhoneNumber('BD')
    @IsOptional()
    phone: string;

    @IsUrl()
    @IsOptional()
    photo: string;
}