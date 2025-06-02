import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { MemberService } from '@member';
import { IS_PUBLIC_KEY } from '../decorators';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

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
    private memberService: MemberService,
    private reflector: Reflector,
    private readonly config: ConfigService
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
    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
      });
      const member = await this.memberService.findById(payload.sub);
      request.member = member;
      return true;
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid or expired token. Error: ' + e.message,
      );
    }
  }
}
