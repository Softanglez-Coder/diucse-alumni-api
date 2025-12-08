import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/feature/user/user.service';
import { CommitteeDesignationService } from 'src/feature/committee-designation/committee-designation.service';
import { passportJwtSecret } from 'jwks-rsa';
import { verify } from 'jsonwebtoken';
import { Role } from '../role';

/**
 * AuthGuard
 *
 * This guard validates JWT tokens from either:
 * 1. The 'auth_token' cookie (for web applications) - validates local JWT from Auth0 callback
 * 2. The Authorization header with Bearer token (for API clients) - validates Auth0 JWT directly
 *
 * Cookie tokens are local JWTs generated after Auth0 authentication for session management.
 * Authorization header tokens are Auth0 JWTs validated against Auth0's JWKS endpoint.
 *
 * If the token is invalid or expired, it throws an UnauthorizedException.
 * Routes marked with @Public() decorator are accessible without authentication.
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
    const isFromCookie = !!token;

    // If no cookie token, try Authorization header (for API clients)
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
      let userId: string;
      let user: any;

      if (isFromCookie) {
        // Validate local JWT token from cookie (generated after Auth0 login)
        const payload = this.jwtService.verify(token, {
          secret: this.config.get<string>('JWT_SECRET'),
        });
        userId = payload.sub;
        user = await this.userService.findById(userId);
      } else {
        // Validate Auth0 JWT token from Authorization header
        const auth0Domain = this.config.get<string>('AUTH0_DOMAIN');
        const auth0Audience = this.config.get<string>('AUTH0_AUDIENCE');

        if (!auth0Domain || !auth0Audience) {
          throw new UnauthorizedException('Auth0 not configured');
        }

        const decoded: any = await this.verifyAuth0Token(
          token,
          auth0Domain,
          auth0Audience,
        );
        const auth0Id = decoded.sub;
        const email = decoded.email;

        // Find or create user from Auth0 token
        user = await this.userService.findByProperty('auth0Id', auth0Id);

        if (!user) {
          if (!email) {
            throw new UnauthorizedException('Email not provided by Auth0');
          }

          // Create new user from Auth0 token
          const isSystemAdmin = email === 'csediualumni.official@gmail.com';
          const roles = isSystemAdmin ? [Role.Admin] : [Role.Guest];

          user = await this.userService.create({
            email,
            auth0Id,
            name: decoded.name || '',
            photo: decoded.picture || null,
            emailVerified: decoded.email_verified || false,
            roles,
          });
        }

        userId = user.id || user._id;
      }

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Get designation roles for the user
      const designationRoles =
        await this.committeeDesignationService.getUserActiveRoles(userId);

      // Combine user's static roles with designation roles
      const allRoles = [
        ...new Set([...(user.roles || []), ...designationRoles]),
      ];

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

  private async verifyAuth0Token(
    token: string,
    domain: string,
    audience: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const getKey = passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      });

      // Decode token to get header for JWKS lookup
      const parts = token.split('.');
      if (parts.length !== 3) {
        return reject(new Error('Invalid token format'));
      }

      let header: any;
      try {
        header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      } catch {
        return reject(new Error('Invalid token header'));
      }

      const decoded = { header };

      getKey(decoded, header, (err: any, key: any) => {
        if (err) {
          return reject(err);
        }

        verify(
          token,
          key,
          {
            audience: audience,
            issuer: `https://${domain}/`,
            algorithms: ['RS256'],
          },
          (err, decoded) => {
            if (err) {
              return reject(err);
            }
            resolve(decoded);
          },
        );
      });
    });
  }
}
