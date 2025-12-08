import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { JwtModule } from '@nestjs/jwt';
import { Auth0Strategy, JwtAuth0Strategy } from './strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UserModule, JwtModule, PassportModule.register({ session: true })],
  providers: [Logger, AuthService, Auth0Strategy, JwtAuth0Strategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
