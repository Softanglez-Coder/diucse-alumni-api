import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from '../member/member.module';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [UserModule, MemberModule, MembershipModule, JwtModule],
  providers: [Logger, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
