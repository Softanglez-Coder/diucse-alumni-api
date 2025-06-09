import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dtos';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators';

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
}
