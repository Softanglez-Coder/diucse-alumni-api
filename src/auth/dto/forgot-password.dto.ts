import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    static email() {
        throw new Error('Method not implemented.');
    }
    @IsNotEmpty()
    username: string;
}
