import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { UserService } from '../../user/user.service';
import { Role } from '../../../core/role';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      domain: configService.get<string>('AUTH0_DOMAIN'),
      clientID: configService.get<string>('AUTH0_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('SERVER_URL')}/auth/auth0/callback`,
      scope: 'openid email profile',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;

    if (!emails || emails.length === 0) {
      throw new UnauthorizedException('Email not provided by Auth0');
    }

    const email = emails[0].value;
    const auth0Id = id;

    // Determine role based on email
    const isSystemAdmin = email === 'csediualumni.official@gmail.com';
    const roles = isSystemAdmin ? [Role.Admin] : [Role.Guest];

    // Find or create user
    let user = await this.userService.findByProperty('auth0Id', auth0Id);

    if (!user) {
      // Try to find user by email
      user = await this.userService.findByProperty('email', email);

      if (user) {
        // Link existing user to Auth0 and update roles if needed
        user.auth0Id = auth0Id;
        if (isSystemAdmin && !user.roles?.includes(Role.Admin)) {
          user.roles = roles;
        }
        user = await this.userService.update(user.id, user);
      } else {
        // Create new user
        user = await this.userService.create({
          email,
          auth0Id,
          name: displayName || '',
          photo: photos && photos.length > 0 ? photos[0].value : null,
          emailVerified: true, // Auth0 handles email verification
          roles,
        });
      }
    } else if (isSystemAdmin && !user.roles?.includes(Role.Admin)) {
      // Update existing Auth0 user to have Admin role if needed
      user.roles = roles;
      user = await this.userService.update(user.id, user);
    }

    return user;
  }
}
