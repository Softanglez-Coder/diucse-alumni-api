import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async generateTokenForUser(user: any) {
    const token = this.jwtService.sign(
      {
        sub: user.id || user._id,
        email: user.email,
        roles: user.roles || [],
      },
      {
        expiresIn: '7d',
        secret: this.config.get<string>('JWT_SECRET'),
      },
    );

    this.logger.log(`JWT token generated for user with email: ${user.email}`);

    return { accessToken: token };
  }
}
