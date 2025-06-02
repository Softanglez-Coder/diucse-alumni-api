import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';

import {
  AuthGuard,
  CleanResponseInterceptor,
  DatabaseModule,
  LoggingInterceptor,
  RolesGuard,
  StorageModule,
} from '@core';

import { PaymentModule } from '@payment';
import { JwtModule } from '@nestjs/jwt';
import { SettingsModule } from './features/settings/settings.module';
import { MemberModule } from '@member';
import { AuthModule } from './features/auth';

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

    JwtModule,

    // Core modules
    DatabaseModule,
    StorageModule,

    // Feature modules
    AuthModule,
    SettingsModule,
    PaymentModule,
    MemberModule
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CleanResponseInterceptor,
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
