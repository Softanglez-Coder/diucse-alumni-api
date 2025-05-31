import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailerModule } from '@core';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { TokenModule } from '@token';

@Module({
  controllers: [AuthController],
  imports: [
    MailerModule,
    UserModule,
    TokenModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    Logger
  ],
})
export class AuthModule {}
