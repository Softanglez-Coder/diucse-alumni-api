import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    static email(email: any, token: string) {
        throw new Error('Method not implemented.');
    }
    email(email: any, token: string) {
        throw new Error('Method not implemented.');
    }
    @IsNotEmpty()
    username: string;
}
