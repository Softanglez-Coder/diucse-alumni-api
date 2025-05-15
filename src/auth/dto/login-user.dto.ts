import {
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
} from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Password must be at least 8 characters long and include at least one letter, one number, and one special character.',
    })
    password: string;
}
