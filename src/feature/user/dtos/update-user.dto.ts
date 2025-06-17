import { IsMongoId, IsString } from "class-validator";
import mongoose, { mongo } from "mongoose";

export class UpdateUserDto {
    @IsString()
    name?: string;

    @IsString()
    email?: string;

    @IsString()
    phone?: string;

    @IsMongoId()
    batch: mongoose.Schema.Types.ObjectId;
}