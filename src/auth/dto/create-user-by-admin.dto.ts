import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUserByAdminDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Password too weak. Must be at least 8 characters and include numbers and special characters.',
    })
    password: string;

    @IsNotEmpty()
    status: 'approved' | 'pending'; // optional but useful
}
