import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('reset-password/:token')
    async verifyResetToken(@Param('token') token: string) {
        const user = await this.authService.findByResetToken(token);
        if (!user) throw new NotFoundException('Invalid or expired token');
        return { message: 'Token is valid' };
    }

    @Post('register')
    async register(@Body() registerDto: RegisterUserDto) {
        return this.authService.registerUser(registerDto);
    }

    @Post('login')
    login(@Body() dto: LoginUserDto) {
        return this.authService.loginUser(dto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        await this.authService.forgotPassword(dto);
        return { message: 'Password reset email sent if user exists' };
    }

    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req) {
        return this.authService.getMe(req.user.userId);
    }

    @Get('pending-users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getPendingUsers() {
        return this.authService.getPendingUsers();
    }

    @Patch('approve/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async approveUser(@Param('id') id: string) {
        return this.authService.approveUser(id);
    }
}



