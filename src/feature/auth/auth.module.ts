import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { JwtModule } from '@nestjs/jwt';
import { MembershipModule } from '../membership/membership.module';
import { MailModule } from '../mail';

@Module({
  imports: [UserModule, MembershipModule, JwtModule, MailModule],
  providers: [Logger, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
