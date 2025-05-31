import {
  Body,
  Controller, Get, Headers, HttpCode, HttpStatus, NotImplementedException,
  Post,
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, RequestExtension } from '@core';
import { RegisterResponse } from './responses';
import { LoginRequest, RecoverPasswordRequest, RegisterRequest, ResetPasswordRequest } from './requests';
import { LoginResponse } from './responses/login.response';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() body: RegisterRequest): Promise<RegisterResponse> {
    return await this.authService.register(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() request: RequestExtension): Promise<void> {
    return await this.authService.logout(request);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('recover-password')
  async forgotPassword(@Body() body: RecoverPasswordRequest): Promise<void> {
    return await this.authService.recoverPassword(body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordRequest,
    @Req() request: RequestExtension,
  ): Promise<void> {
    return await this.authService.resetPassword(request.user, body);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('verify-email')
  async verifyEmail(@Req() request: RequestExtension): Promise<string> {
    return await this.authService.verifyEmail(request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('send-verification-email')
  async sendVerificationEmail(@Req() request: RequestExtension): Promise<void> {
    return await this.authService.sendVerificationEmail(request);
  }
}
