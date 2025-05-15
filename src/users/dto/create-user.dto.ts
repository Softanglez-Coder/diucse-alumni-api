import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                'Password must be at least 8 characters long and include at least one letter, one number, and one special character.',
        },
    )
    password: string;
}
