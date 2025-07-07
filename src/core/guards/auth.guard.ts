import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/feature/user/user.service';

/**
 * AuthGuard
 *
 * This guard checks if the request has a valid JWT token in the Authorization header.
 * If the token is valid, it retrieves the user associated with the token and attaches it to the request object.
 * If the token is invalid or expired, it throws an UnauthorizedException.
 *
 * It also checks if the route is public using the IS_PUBLIC_KEY metadata.
 * If the route is public, it allows access without authentication.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['auth_token'];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
      });
      const user = await this.userService.findById(payload.sub);
      request.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException(e.message ?? 'Invalid token');
    }
  }
}
