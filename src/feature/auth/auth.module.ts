import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { JwtModule } from '@nestjs/jwt';
import { MembershipModule } from '../membership/membership.module';
import { MailModule } from '../mail';
import { CommitteeDesignationModule } from '../committee-designation';

@Module({
  imports: [UserModule, MembershipModule, JwtModule, MailModule, CommitteeDesignationModule],
  providers: [Logger, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
