import { IsStrongPassword } from "class-validator";

export class ResetPasswordRequest {
    @IsStrongPassword()
    newPassword: string;
}