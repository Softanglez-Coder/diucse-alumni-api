import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dtos';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators';
import { RequestExtension } from 'src/core/types';
import { Response } from 'express';
import { UserService } from '../user';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction, // Only use secure cookies in production (HTTPS)
      sameSite: 'lax' as const, // Use 'lax' for both dev and prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      // In production, use domain to share across subdomains
      // In development, omit domain to work with localhost:port
      ...(isProduction && { domain: '.csediualumni.com' }),
    };
  }

  @Public()
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: RegisterDto,
  ) {
    const { accessToken } = await this.authService.register(payload);

    res.cookie('auth_token', accessToken, this.getCookieOptions());

    return { message: 'Registration successful' };
  }

  @Public()
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: LoginDto,
  ) {
    const { accessToken } = await this.authService.login(payload);

    res.cookie('auth_token', accessToken, this.getCookieOptions());

    return { message: 'Login successful' };
  }

  @Get('me')
  async me(@Req() req: RequestExtension) {
    // Get fresh user data with all roles (static + designation roles)
    if (req.user?.id) {
      return await this.userService.findByIdWithAllRoles(req.user.id);
    }
    // Fallback to request user if service fails
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
    res.clearCookie('auth_token', this.getCookieOptions());

    return { message: 'Logout successful' };
  }

  @Public()
  @Post('token')
  async getToken(@Body() payload: LoginDto) {
    const { accessToken } = await this.authService.login(payload);

    return {
      accessToken,
      message: 'Use this token in Authorization header as: Bearer <token>',
    };
  }
}
