import { Controller, Get, Patch, Param, UseGuards, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateUserByAdminDto } from 'src/auth/dto/create-user-by-admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminController {
    constructor(private readonly authService: AuthService) { }

    @Get('pending-users')
    async getPendingUsers() {
        return this.authService.getPendingUsers();
    }

    @Patch('approve/:id')
    async approveUser(@Param('id') id: string) {
        return this.authService.approveUser(id);
    }

    @Post('create-user')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async createUserByAdmin(
        @Body() dto: CreateUserByAdminDto,
        @Req() req
    ) {
        return this.authService.createUserByAdmin(dto);
    }

}
