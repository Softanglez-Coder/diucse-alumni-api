import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}