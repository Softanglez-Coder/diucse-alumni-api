import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateMemberRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}