import { IsOptional, IsString } from "class-validator";

export class RecoverPasswordRequest {
    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    email: string;
}