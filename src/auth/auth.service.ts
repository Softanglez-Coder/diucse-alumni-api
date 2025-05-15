import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User, UserDocument } from './schema/user.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<any> {
    const existing = await this.userModel.findOne({ username: dto.username });
    if (existing) throw new ConflictException('Username already taken');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      username: dto.username,
      password: hashed,
    });
    return user.save();
  }

  async loginUser(dto: LoginUserDto): Promise<any> {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== 'approved') {
      throw new UnauthorizedException(
        'Your account is not yet approved by admin',
      );
    }

    const payload = { sub: user._id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user._id,
        username: user.username,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) throw new NotFoundException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    await user.save();

    await this.emailService.sendResetPasswordEmail(user.username, token);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ resetToken: dto.token });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return { message: 'Password has been reset successfully' };
  }

  async findByResetToken(token: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    return user;
  }

  async getMe(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .select('-password -resetToken -resetTokenExpiry');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findPendingUsers(): Promise<User[]> {
    return this.userModel.find({ isApproved: false });
  }

  async getPendingUsers(): Promise<User[]> {
    return this.userModel.find({ status: 'pending' }).exec();
  }

  async approveUser(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
  }
}
