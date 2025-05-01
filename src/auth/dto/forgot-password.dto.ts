import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  static email(_email: any, _token: string) {
    throw new Error('Method not implemented.');
  }
  email(_email: any, _token: string) {
    throw new Error('Method not implemented.');
  }

  @IsNotEmpty()
  username: string;
}
