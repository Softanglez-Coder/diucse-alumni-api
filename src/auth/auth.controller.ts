import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('password/forgot')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return { message: 'Password reset email sent if user exists' };
  }

  @Post('password/reset')
  async verifyResetToken(@Body('token') token: string) {
    const user = await this.authService.findByResetToken(token);
    if (!user) throw new NotFoundException('Invalid or expired token');
    return { message: 'Token is valid' };
  }

  @Post('password/reset/confirm')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.loginUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return this.authService.getMe(req.user.userId);
  }
}
