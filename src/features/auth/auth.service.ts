import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotImplementedException
} from '@nestjs/common';
import { LoginRequest, RecoverPasswordRequest, RegisterRequest, ResetPasswordRequest } from './requests';
import { RegisterResponse } from './responses';
import { LoginResponse } from './responses/login.response';
import { CreateUserRequest, UserEntity, UserService } from '@user';
import { MailerService, RequestExtension, Role, Template } from '@core';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly tokenService: TokenService,
    private readonly logger: Logger
  ) {}

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    this.logger.log('Registering user', payload.email);

    const newUser: CreateUserRequest = {
      email: payload.email,
      username: payload.username,
      name: payload.name,
      password: payload.password
    };

    const user = await this.userService.create(newUser, [ Role.Guest ]);
    if (!user) {
      throw new InternalServerErrorException('User could not be created');
    }

    this.logger.log(`User created successfully for ${user.username}`, user.id);

    const response: RegisterResponse = {
      email: user.email,
      username: user.username,
      name: user.name,
    };

    try {
      await this.mailService.send({
        to: user.email,
        subject: 'Welcome to CSE DIU Alumni',
        template: Template.RegisteredAsGuest,
        variables: {
          member_name: user.name,
        }
      });
      this.logger.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${user.email}`, error);
      throw new InternalServerErrorException('Failed to send welcome email');
    }

    return response;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    this.logger.log('User login attempt', payload.username);

    const user = await this.userService.findByUsername(payload.username, false);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    this.logger.log(`User found: ${user.username}`, user.id);

    if (!user.hash) {
      throw new BadRequestException('User password is not set');
    }

    if (!payload.password) {
      throw new BadRequestException('Password is required');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User is not active');
    }

    const passwordMatched = await this.comparePassword(payload.password, user.hash);
    if (!passwordMatched) {
      throw new BadRequestException('Invalid password');
    }

    const { access } = this.generateToken(user);

    const response: LoginResponse = {
      accessToken: access
    };

    if (!response.accessToken) {
      throw new InternalServerErrorException('Could not generate tokens');
    }

    const tokenStored = await this.tokenService.store(user.username, response.accessToken);
    if (!tokenStored) {
      throw new InternalServerErrorException('Could not store refresh token');
    }

    this.logger.log(`User ${user.username} logged in successfully`, user.id);

    return response;
  }

  async logout(request: RequestExtension): Promise<void> {
    this.logger.log(`User logout attempt for ${request.user?.username}`);

    if (!request.user) {
      throw new BadRequestException('User not found');
    }

    const accessToken = request.headers.authorization?.split(' ')[1];
    const token = await this.tokenService.findByToken(accessToken);
    if (!token) {
      throw new BadRequestException('No tokens found for user');
    }

    await this.tokenService.invalidate(accessToken);
    this.logger.log(`Invalidated token for user ${request.user?.username}`);

    this.logger.log(`User ${request.user?.username} logged out successfully`);
  }

  async recoverPassword(payload: RecoverPasswordRequest): Promise<void> {
    throw new NotImplementedException();
  }

  async resetPassword(user: UserEntity, payload: ResetPasswordRequest): Promise<void> {
    throw new NotImplementedException();
  }

  async verifyEmail(request: RequestExtension): Promise<string> {
    const token = request.query.token as string;
    this.logger.log(`Email verification attempt with token: ${token}`);
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const id = this.jwtService.decode(token)?.sub;
    if (!id) {
      throw new BadRequestException('Invalid verification token');
    }

    const user = await this.userService.findById(id as string, false);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    user.isEmailVerified = true;

    const updatedUser = await this.userService.update(user.id, user);
    if (!updatedUser) {
      throw new InternalServerErrorException('Could not update user email verification status');
    }

    this.logger.log(`Email verified successfully for user ${user.username}`, user.id);

    return 'Email verified successfully';
  }

  async sendVerificationEmail({ user, host }: RequestExtension): Promise<void> {
    this.logger.log(`Sending verification email to ${user.email}`);

    if (!user.email) {
      throw new BadRequestException('User email is not provided');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    const verificationToken = this.generateToken(user);
    if (!verificationToken) {
      throw new InternalServerErrorException('Could not generate verification token');
    }

    try {
      await this.mailService.send({
        to: user.email,
        subject: 'Verify your email',
        template: Template.EmailVerification,
        variables: {
          member_name: user.username,
          verification_link: `${host}/auth/verify-email?token=${verificationToken.access}`
        }
      });
      this.logger.log(`Verification email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${user.email}`, error);
      throw new InternalServerErrorException('Failed to send verification email');
    }
  }



  // private
  private async comparePassword(password: string, hash: string): Promise<boolean> {
        if (!password || !hash) {
            throw new BadRequestException("Password or hash is not provided");
        }

        const matched = await bcrypt.compare(password, hash);
        if (!matched) {
            throw new BadRequestException("Password does not match");
        }

        return matched;
    }

  private generateToken(user: UserEntity): { access: string; } {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles
    };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET
    });

    return {
      access: accessToken
    };
  }
}
