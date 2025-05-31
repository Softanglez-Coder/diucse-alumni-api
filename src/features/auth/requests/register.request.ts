import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class RegisterRequest {
    @IsString()
    username: string;
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}