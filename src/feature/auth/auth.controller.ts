import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dtos';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators';
import { RequestExtension } from 'src/core/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return await this.authService.register(payload);
  }

  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload);
  }

  @Get('me')
  async me(@Req() req: RequestExtension) {
    return await this.authService.me(req.user?.id);
  }

  @Public()
  @Patch('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Public()
  @Patch('reset-password')
  async resetPassword(
    @Req() req: RequestExtension,
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return await this.authService.resetPassword(
      req.user?.id,
      token,
      password,
    );
  }

  @Patch('change-password')
  async changePassword(
    @Req() req: RequestExtension,
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return await this.authService.resetPassword(
      req.user?.id,
      token,
      password,
    );
  }

  @Post('resend-verification-email')
  async resendVerificationEmail(@Req() req: RequestExtension) {
    return await this.authService.resendVerificationEmail(req.user?.id);
  }
}
