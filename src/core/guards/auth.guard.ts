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
 * This guard validates JWT tokens from the Authorization header with Bearer token.
 * It validates Auth0 JWT directly against Auth0's JWKS endpoint.
 *
 * If the token is invalid or expired, it throws an UnauthorizedException.
 * Routes marked with @Public() decorator are accessible without authentication.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new (require('@nestjs/common').Logger)(
    AuthGuard.name,
  );

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

    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Validate Auth0 JWT token
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

      this.logger.log(`Auth0 token decoded - Auth0 ID: ${auth0Id}, Email: ${email}`);

      // Find or create user from Auth0 token
      let user = await this.userService.findByProperty('auth0Id', auth0Id);

      if (!user) {
        if (!email) {
          this.logger.error('Email not provided by Auth0 in token');
          throw new UnauthorizedException('Email not provided by Auth0');
        }

        // Check if user exists with this email (without auth0Id)
        const existingUserByEmail = await this.userService.findByProperty('email', email);
        
        if (existingUserByEmail) {
          this.logger.log(`User exists with email ${email}, updating with auth0Id`);
          // Update existing user with auth0Id
          existingUserByEmail.auth0Id = auth0Id;
          if (decoded.name) existingUserByEmail.name = decoded.name;
          if (decoded.picture) existingUserByEmail.photo = decoded.picture;
          existingUserByEmail.emailVerified = decoded.email_verified || false;
          
          user = await this.userService.update(
            existingUserByEmail.id || existingUserByEmail._id.toString(),
            existingUserByEmail
          );
          this.logger.log(`User updated with auth0Id: ${user.id || user._id}`);
        } else {
          this.logger.log(`User not found, creating new user with email: ${email}`);

          // Create new user from Auth0 token
          const isSystemAdmin = email === 'csediualumni.official@gmail.com';
          const roles = isSystemAdmin ? [Role.Admin] : [Role.Guest];

          const userData = {
            email,
            auth0Id,
            name: decoded.name || email.split('@')[0],
            photo: decoded.picture || null,
            emailVerified: decoded.email_verified || false,
            roles,
            active: true,
          };

          this.logger.log(`Creating user with data:`, JSON.stringify(userData));

          try {
            user = await this.userService.create(userData);
            this.logger.log(`User created successfully with ID: ${user.id || user._id}`);
          } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`, error.stack);
            
            // If it's a duplicate key error, try to find the user again
            if (error.code === 11000 || error.message.includes('duplicate')) {
              this.logger.log(`Duplicate key error, attempting to find existing user`);
              user = await this.userService.findByProperty('auth0Id', auth0Id) ||
                     await this.userService.findByProperty('email', email);
              
              if (user) {
                this.logger.log(`Found existing user after duplicate error: ${user.id || user._id}`);
              } else {
                throw new UnauthorizedException(`Failed to create or find user: ${error.message}`);
              }
            } else {
              throw new UnauthorizedException(`Failed to create user: ${error.message}`);
            }
          }
        }
      } else {
        this.logger.log(`Existing user found with ID: ${user.id || user._id}`);
      }

      const userId = user.id || user._id;

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
