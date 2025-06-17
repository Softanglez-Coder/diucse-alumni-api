import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserService } from '../user';
import { LoginDto, RegisterDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MemberService } from '../member/member.service';
import { MembershipService } from '../membership/membership.service';
import { MailService, Template } from '../mail';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly memberService: MemberService,
    private readonly membershipService: MembershipService,
    private readonly mailService: MailService
  ) {}

  async register(payload: RegisterDto) {
    this.logger.log(`Attempting to register user with email: ${payload.email}`);

    const existingUser = await this.userService.findByProperty(
      'email',
      payload.email,
    );
    if (existingUser) {
      this.logger.warn(
        `Registration failed: User already exists with email: ${payload.email}`,
      );
      throw new ConflictException('User already exists with this email');
    }

    const hash = bcrypt.hashSync(payload.password, 10);

    const user: User = {
      email: payload.email,
      password: hash,
      name: payload.name,
    };

    this.logger.log(`Registering user with email: ${user.email}`);

    const createdUser = await this.userService.create(user);
    this.logger.log(`User created with ID: ${createdUser.id}`);

    if (!createdUser) {
      this.logger.error(`Failed to create user with email: ${user.email}`);
      throw new InternalServerErrorException('User registration failed');
    }

    this.logger.log(`User registration successful for email: ${user.email}`);

    const loggedIn = await this.login({
      email: user.email,
      password: payload.password,
    });

    this.logger.log(`JWT token generated for user with email: ${user.email}`);

    // Send welcome email
    try {
      await this.mailService.send({
        subject: 'Welcome to CSE DIU Alumni',
        to: [user.email],
        template: Template.RegisteredAsGuest,
        variables: {
          member_name: user.name ?? 'Guest',
        },
        attachments: [
          {
            filename: 'welcome.jpg',
            path: 'https://static.vecteezy.com/system/resources/previews/011/976/274/non_2x/stick-figures-welcome-free-vector.jpg'
          }
        ]
      });

      this.logger.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${user.email}: ${error.message}`,
      );
    }

    return loggedIn;
  }

  async login(payload: LoginDto) {
    this.logger.log(`Attempting to log in user with email: ${payload.email}`);

    const user = await this.userService.findByProperty(
      'email',
      payload.email,
      false,
    );
    if (!user) {
      this.logger.warn(
        `Login failed: User not found for email: ${payload.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.active) {
      this.logger.warn(
        `Login failed: User account is inactive for email: ${payload.email}`,
      );
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = bcrypt.compareSync(payload.password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(
        `Login failed: Invalid password for email: ${payload.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in successfully with email: ${payload.email}`);

    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles || [],
      },
      {
        expiresIn: '7d',
        secret: this.config.get<string>('JWT_SECRET'),
      },
    );

    this.logger.log(
      `JWT token generated for user with email: ${payload.email}`,
    );

    return { accessToken: token };
  }

  async me(userId: string) {
    this.logger.log(`Fetching user details for user ID: ${userId}`);

    const user = await this.userService.findById(userId);
    if (!user) {
      this.logger.error(`User not found with ID: ${userId}`);
      throw new InternalServerErrorException('User not found');
    }

    this.logger.log(`User details fetched successfully for user ID: ${userId}`);

    const membership = await this.membershipService.findByProperty(
      'user',
      userId,
    );
    if (!membership) {
      this.logger.warn(`No membership found for user ID: ${userId}`);
    }

    let member = null;
    if (membership) {
      member = await this.memberService.findByProperty(
        'membership',
        membership?.id,
      );
    }

    const response: any = {
      user: user,
    };

    if (member) {
      response.member = member;
    }

    this.logger.log(
      `User details returned successfully for user ID: ${userId}`,
    );
    return response;
  }

  async verifyEmail(token: string) {
    this.logger.log(`Verifying email with token: ${token}`);
    let payload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      this.logger.error(`Email verification failed: Invalid token`);
      throw new UnauthorizedException('Invalid or expired token');
    }
    this.logger.log(`Token verified successfully for user ID: ${payload.sub}`);
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      this.logger.error(`Email verification failed: User not found with ID: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    if (user.emailVerified) {
      this.logger.warn(`Email already verified for user ID: ${user.id}`);
      throw new ConflictException('Email already verified');
    }

    user.emailVerified = true;
    const updatedUser = await this.userService.update(user.id, user);
    if (!updatedUser) {
      this.logger.error(`Email verification failed: Failed to update user ID: ${user.id}`);
      throw new InternalServerErrorException('Email verification failed');
    }
    this.logger.log(`Email verified successfully for user ID: ${user.id}`);

    // Send email verification success notification
    try {
      await this.mailService.send({
        subject: 'Email Verified Successfully',
        to: [user.email],
        template: Template.EmailVerified,
        variables: {
          member_name: user.name || 'Guest',
        },
      });

      this.logger.log(`Email verification success notification sent to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email verification success notification to ${user.email}: ${error.message}`,
      );
    }

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    this.logger.log(`Processing forgot password for email: ${email}`);

    const user = await this.userService.findByProperty('email', email);
    if (!user) {
      this.logger.warn(`Forgot password failed: User not found for email: ${email}`);
      throw new UnauthorizedException('User not found');
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn: '1h',
        secret: this.config.get<string>('JWT_SECRET'),
      },
    );

    // Send reset email
    try {
      await this.mailService.send({
        subject: 'Password Reset Request',
        to: [user.email],
        template: Template.ForgotPassword,
        variables: {
          reset_link: `${this.config.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`,
          member_name: user.name || 'Guest',
        },
      });

      this.logger.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${user.email}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to send reset email');
    }

    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(userId: string, token: string, newPassword: string) {
    if (token && !userId) {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      userId = payload.sub;
    }

    this.logger.log(`Resetting password for user ID: ${userId}`);

    const user = await this.userService.findById(userId);
    if (!user) {
      this.logger.error(`User not found with ID: ${userId}`);
      throw new InternalServerErrorException('User not found');
    }

    if (!newPassword) {
      this.logger.error(`Password reset failed: New password is required`);
      throw new BadRequestException('New password is required');
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    user.password = hash;

    const updatedUser = await this.userService.update(user.id, user);
    if (!updatedUser) {
      this.logger.error(`Failed to update password for user ID: ${userId}`);
      throw new InternalServerErrorException('Password reset failed');
    }

    this.logger.log(`Password reset successfully for user ID: ${userId}`);

    // Send password reset success notification
    try {
      await this.mailService.send({
        subject: 'Password Reset Successfully',
        to: [user.email],
        template: Template.PasswordReset,
        variables: {
          member_name: user.name || 'Guest',
        },
      });

      this.logger.log(`Password reset success notification sent to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset success notification to ${user.email}: ${error.message}`,
      );
    }

    return { message: 'Password reset successfully' };
  }

  async resendVerificationEmail(userId: string) {
    this.logger.log(`Resending verification email for user ID: ${userId}`);

    const user = await this.userService.findById(userId);
    if (!user) {
      this.logger.error(`User not found with ID: ${userId}`);
      throw new InternalServerErrorException('User not found');
    }

    if (user.emailVerified) {
      this.logger.warn(`Email already verified for user ID: ${userId}`);
      throw new ConflictException('Email already verified');
    }

    // Send verification email
    try {
      await this.mailService.send({
        subject: 'Email Verification',
        to: [user.email],
        template: Template.EmailVerification,
        variables: {
          verification_link: `${this.config.get<string>('FRONTEND_URL')}/verify-email?token=${this.jwtService.sign(
            { sub: user.id, email: user.email },
            {
              expiresIn: '1h',
              secret: this.config.get<string>('JWT_SECRET'),
            },
          )}`,
          member_name: user.name || 'Guest',
        },
      });

      this.logger.log(`Verification email resent to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to resend verification email to ${user.email}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to resend verification email');
    }

    return { message: 'Verification email resent successfully' };
  }
}
