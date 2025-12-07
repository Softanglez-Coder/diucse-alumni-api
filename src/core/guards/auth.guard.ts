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
import { passportJwtSecret } from 'jwks-rsa';
import { verify } from 'jsonwebtoken';
import { Role } from '../role';

/**
 * AuthGuard
 *
 * This guard checks if the request has a valid JWT token in either:
 * 1. The 'auth_token' cookie (for web applications with local JWT)
 * 2. The Authorization header with Bearer token (supports both local JWT and Auth0 JWT)
 *
 * For Auth0 tokens, it validates against Auth0's JWKS endpoint
 * For local tokens, it validates against the local JWT_SECRET
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

    // Try to get token from cookie first (for web apps with local JWT)
    let token = request.cookies?.['auth_token'];
    let isAuth0Token = false;

    // If no cookie token, try Authorization header (for Postman/API testing and Auth0)
    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
        isAuth0Token = true; // Assume Auth0 token if from Authorization header
      }
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      let userId: string;
      let user: any;

      if (isAuth0Token) {
        // Try to verify as Auth0 token
        try {
          const auth0Domain = this.config.get<string>('AUTH0_DOMAIN');
          const auth0Audience = this.config.get<string>('AUTH0_AUDIENCE');

          if (auth0Domain && auth0Audience) {
            const decoded: any = await this.verifyAuth0Token(
              token,
              auth0Domain,
              auth0Audience,
            );
            const auth0Id = decoded.sub;
            const email = decoded.email;

            // Find or create user from Auth0 token
            user = await this.userService.findByProperty('auth0Id', auth0Id);

            if (!user && email) {
              // Try to find by email
              user = await this.userService.findByProperty('email', email);

              if (user) {
                // Link existing user to Auth0
                const isSystemAdmin =
                  email === 'csediualumni.official@gmail.com';
                const roles = isSystemAdmin
                  ? [Role.Admin]
                  : user.roles || [Role.Guest];

                user.auth0Id = auth0Id;
                if (isSystemAdmin && !user.roles?.includes(Role.Admin)) {
                  user.roles = roles;
                }
                user = await this.userService.update(user.id, user);
              } else {
                // Create new user from Auth0 token
                const isSystemAdmin =
                  email === 'csediualumni.official@gmail.com';
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
            }

            if (!user) {
              throw new UnauthorizedException('User not found');
            }

            userId = user.id || user._id;
          } else {
            throw new Error('Auth0 not configured');
          }
        } catch {
          // If Auth0 verification fails, try local JWT
          const payload = this.jwtService.verify(token, {
            secret:
              this.config.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
          });
          userId = payload.sub;
          user = await this.userService.findById(userId);
        }
      } else {
        // Verify as local JWT token
        const payload = this.jwtService.verify(token, {
          secret:
            this.config.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
        });
        userId = payload.sub;
        user = await this.userService.findById(userId);
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

      const decoded = this.jwtService.decode(token, { complete: true }) as any;
      if (!decoded || !decoded.header) {
        return reject(new Error('Invalid token'));
      }

      getKey(decoded, decoded.header, (err: any, key: any) => {
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
