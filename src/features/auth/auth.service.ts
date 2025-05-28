import { MailerService } from '@core';
import { MemberService } from '@member';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly memberService: MemberService,
    private readonly mailerService: MailerService,
  ) {}

  async login(email: string, password: string) {
    const valid = await this.userService.validateUser(email, password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      email: user.email,
      roles: user.roles,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
    };
  }

  async recoverPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const member = await this.memberService.findByEmail(email);
    if (!member) {
      throw new UnauthorizedException('Member not found');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    try {
      const body = `
        <p>To reset your password, please click the link below:</p>
        <p><a href="${process.env.RESET_PASSWORD_URL}?token=${token}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        `;
      await this.mailerService.sendMail(user.email, 'Password Recovery', body);
    } catch (error) {
      throw new HttpException(
        `Failed to send recovery email due to ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(newPassword: string, token: string) {
    const payload = this.jwtService.verify(token);
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updated = await this.userService.updatePassword(user.id, newPassword);
    if (!updated) {
      throw new HttpException(
        'Failed to update password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const body = `
                <p>Your password has been successfully updated.</p>
                <p>If you did not request this change, please contact support immediately.</p>
            `;
      await this.mailerService.sendMail(user.email, 'Password Updated', body);
    } catch (error) {
      throw new HttpException(
        `Failed to send confirmation email due to ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Password updated successfully',
      userId: user.id,
    };
  }

  async me(token: string) {
    const payload = this.jwtService.verify(token);
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const member = await this.memberService.findByEmail(user.email);
    if (!member) {
      throw new UnauthorizedException('Member not found');
    }

    return member;
  }
}
