import { Body, Controller, Get, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dtos';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators';
import { RequestExtension } from 'src/core/types';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: RegisterDto
  ) {
    const { accessToken } = await this.authService.register(payload);

    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      
      // if local, set domain to '.localhost', otherwise set to '.csediualumni.com'
      domain: process.env.NODE_ENV === 'production' ? '.csediualumni.com' : '.localhost',
      sameSite: 'lax', // Adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      path: '/',
    });

    return { message: 'Registration successful' };
  }

  @Public()
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: LoginDto
  ) {
    const { accessToken } = await this.authService.login(payload);

    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production

      // if local, set domain to '.localhost', otherwise set to '.csediualumni.com'
      domain: process.env.NODE_ENV === 'production' ? '.csediualumni.com' : '.localhost',
      sameSite: 'lax', // Adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      path: '/',
    });

    return { message: 'Login successful' };
  }

  @Get('me')
  me(@Req() req: RequestExtension) {
    return req.user;
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
    return await this.authService.resetPassword(req.user?.id, token, password);
  }

  @Patch('change-password')
  async changePassword(
    @Req() req: RequestExtension,
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return await this.authService.resetPassword(req.user?.id, token, password);
  }

  @Post('resend-verification-email')
  async resendVerificationEmail(@Req() req: RequestExtension) {
    return await this.authService.resendVerificationEmail(req.user?.id);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', {
      // if local, set domain to '.localhost', otherwise set to '.csediualumni.com'
      domain: process.env.NODE_ENV === 'production' ? '.csediualumni.com' : '.localhost',
      path: '/',
    });

    return { message: 'Logout successful' };
  }
}
