import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule],
  providers: [Logger, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
