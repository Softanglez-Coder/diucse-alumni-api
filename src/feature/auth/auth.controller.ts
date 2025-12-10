import { Controller, Get, Req } from '@nestjs/common';
import { Public } from 'src/core/decorators';
import { RequestExtension } from 'src/core/types';
import { UserService } from '../user';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

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
  @Get('health')
  health() {
    return { status: 'ok', message: 'Auth service is running' };
  }
}
