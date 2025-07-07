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

    // Cookie domain configuration based on environment
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      // For local development with custom hosts, use '.localhost' to share across subdomains
      // For production, use '.csediualumni.com'
      domain: process.env.NODE_ENV === 'production' ? '.csediualumni.com' : '.localhost',
    };

    res.cookie('auth_token', accessToken, cookieOptions);

    return { message: 'Registration successful' };
  }

  @Public()
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: LoginDto
  ) {
    const { accessToken } = await this.authService.login(payload);

    // Cookie domain configuration based on environment
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      // For local development with custom hosts, use '.localhost' to share across subdomains
      // For production, use '.csediualumni.com'
      domain: process.env.NODE_ENV === 'production' ? '.csediualumni.com' : '.localhost',
    };

    res.cookie('auth_token', accessToken, cookieOptions);

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
    const cookieOptions = {
      path: '/',
      // For local development with custom hosts, use '.localhost' to share across subdomains
      // For production, use '.csediualumni.com'
      domain: process.env.NODE_ENV === 'production' ? '.csediualumni.com' : '.localhost',
    };

    res.clearCookie('auth_token', cookieOptions);

    return { message: 'Logout successful' };
  }
}
