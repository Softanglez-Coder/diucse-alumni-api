import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators';
import { RequestExtension } from 'src/core/types';
import { Response } from 'express';
import { UserService } from '../user';
import { Auth0Guard } from './guards';

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

  @Get('me')
  async me(@Req() req: RequestExtension) {
    // Get fresh user data with all roles (static + designation roles)
    if (req.user?.id) {
      return await this.userService.findByIdWithAllRoles(req.user.id);
    }
    // Fallback to request user if service fails
    return req.user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', this.getCookieOptions());

    return { message: 'Logout successful' };
  }

  /**
   * Initiates Auth0 login flow
   * Redirects to Auth0 login page
   */
  @Public()
  @Get('auth0/login')
  @UseGuards(Auth0Guard)
  auth0Login() {
    // Guard handles redirect to Auth0
  }

  /**
   * Auth0 callback endpoint
   * Handles the callback from Auth0 after successful authentication
   */
  @Public()
  @Get('auth0/callback')
  @UseGuards(Auth0Guard)
  async auth0Callback(@Req() req: RequestExtension, @Res() res: Response) {
    // User is attached to request by Auth0Strategy
    const user = req.user;

    // Generate JWT token for the user
    const { accessToken } = await this.authService.generateTokenForUser(user);

    // Set cookie
    res.cookie('auth_token', accessToken, this.getCookieOptions());

    // Redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    return res.redirect(`${frontendUrl}/auth/callback?success=true`);
  }
}
