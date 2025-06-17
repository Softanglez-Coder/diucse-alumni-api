import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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
}
