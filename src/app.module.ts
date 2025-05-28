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
import { MembershipModule } from '@membership';
import { BatchModule } from '@batch';
import { ShiftModule } from '@shift';
import { MediaModule } from '@media';
import { UserModule } from '@user';
import { MemberModule } from '@member';
import { AuthModule } from './features/auth';
import { JwtModule } from '@nestjs/jwt';

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
    MediaModule,
    PaymentModule,
    MembershipModule,
    BatchModule,
    ShiftModule,
    UserModule,
    MemberModule,
    AuthModule,
    JwtModule,
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
