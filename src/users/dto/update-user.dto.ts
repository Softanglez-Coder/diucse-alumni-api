export class UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    status?: 'pending' | 'approved';
    role?: 'user' | 'admin';
}
