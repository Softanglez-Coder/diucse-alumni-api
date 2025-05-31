import { IsEmail, IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
