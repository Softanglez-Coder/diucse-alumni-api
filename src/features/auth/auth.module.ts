import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailerModule } from '@core';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from '@member';
import { UserModule } from '@user';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [
    MailerModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
        verifyOptions: { algorithms: ['HS256'] },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    MemberModule,
    UserModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
