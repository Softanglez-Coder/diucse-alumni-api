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
import { CommitteeDesignationService } from 'src/feature/committee-designation/committee-designation.service';

/**
 * AuthGuard
 *
 * This guard checks if the request has a valid JWT token in either:
 * 1. The 'auth_token' cookie (for web applications)
 * 2. The Authorization header with Bearer token (for API testing tools like Postman)
 *
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
    private committeeDesignationService: CommitteeDesignationService,
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

    // Try to get token from cookie first (for web apps)
    let token = request.cookies?.['auth_token'];

    // If no cookie token, try Authorization header (for Postman/API testing)
    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
      });
      const user = await this.userService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Get designation roles for the user
      const designationRoles = await this.committeeDesignationService.getUserActiveRoles(payload.sub);
      
      // Combine user's static roles with designation roles
      const allRoles = [...new Set([...(user.roles || []), ...designationRoles])];
      
      // Attach user with all roles to request
      request.user = {
        ...user.toObject(),
        id: user.id,
        roles: allRoles,
        designationRoles, // Also include designation roles separately for reference
      };
      
      return true;
    } catch (e) {
      throw new UnauthorizedException(e.message ?? 'Invalid token');
    }
  }
}
