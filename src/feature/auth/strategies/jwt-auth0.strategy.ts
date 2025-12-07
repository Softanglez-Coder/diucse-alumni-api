import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { UserService } from '../../user/user.service';
import { Role } from '../../../core/role';

@Injectable()
export class JwtAuth0Strategy extends PassportStrategy(Strategy, 'jwt-auth0') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const audience = configService.get<string>('AUTH0_AUDIENCE');

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<any> {
    const auth0Id = payload.sub;

    if (!auth0Id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const email = payload.email;

    // Determine role based on email
    const isSystemAdmin = email === 'csediualumni.official@gmail.com';
    const roles = isSystemAdmin ? [Role.Admin] : [Role.Guest];

    // Find user by Auth0 ID
    let user = await this.userService.findByProperty('auth0Id', auth0Id);

    if (!user) {
      // Try to find or create user from token email
      if (email) {
        user = await this.userService.findByProperty('email', email);

        if (user) {
          // Link existing user to Auth0 and update roles if needed
          user.auth0Id = auth0Id;
          if (isSystemAdmin && !user.roles?.includes(Role.Admin)) {
            user.roles = roles;
          }
          user = await this.userService.update(user.id, user);
        } else {
          // Create new user from token
          user = await this.userService.create({
            email,
            auth0Id,
            name: payload.name || '',
            photo: payload.picture || null,
            emailVerified: payload.email_verified || false,
            roles,
          });
        }
      } else {
        throw new UnauthorizedException('User not found');
      }
    } else if (isSystemAdmin && !user.roles?.includes(Role.Admin)) {
      // Update existing Auth0 user to have Admin role if needed
      user.roles = roles;
      user = await this.userService.update(user.id, user);
    }

    return user;
  }
}
