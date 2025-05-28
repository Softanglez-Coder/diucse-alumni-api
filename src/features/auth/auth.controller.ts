import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos';
import { AuthService } from './auth.service';
import { Public } from '@core';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    return await this.authService.login(email, password);
  }

  @Public()
  @Post('recover-password')
  async recoverPassword(@Body() body: { email: string }) {
    const { email } = body;
    return await this.authService.recoverPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { newPassword: string },
    @Headers('Authorization') token: string,
  ) {
    const { newPassword } = body;

    // Assuming the token is in the format "Bearer <token>"
    const tokenValue = token.split(' ')[1];
    if (!tokenValue) {
      throw new UnauthorizedException(
        'Invalid token format. Expected "Bearer <token>"',
      );
    }

    return await this.authService.resetPassword(newPassword, tokenValue);
  }

  @Get('me')
  @Header('Cache-Control', 'none')
  async me(@Headers('Authorization') token: string) {
    // Assuming the token is in the format "Bearer <token>"
    const tokenValue = token.split(' ')[1];
    if (!tokenValue) {
      throw new UnauthorizedException(
        'Invalid token format. Expected "Bearer <token>"',
      );
    }

    return await this.authService.me(tokenValue);
  }
}
