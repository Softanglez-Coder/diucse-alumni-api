import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';

import {
  AuthGuard,
  DatabaseModule,
  LoggingInterceptor,
  RolesGuard,
  StorageModule,
} from '@core';

import { PaymentModule } from '@payment';
import { AuthModule } from './features/auth';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from './features/settings/settings.module';
import { UserModule } from './features/user/user.module';
import { TokenModule } from './features/token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 10,
        },
      ],
    }),
    DatabaseModule,
    StorageModule,
    PaymentModule,
    AuthModule,
    JwtModule,
    HttpModule,
    SettingsModule,
    UserModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
