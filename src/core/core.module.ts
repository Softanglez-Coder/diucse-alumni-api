import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RolesGuard } from './guards';
import { PaymentGatewayModule } from './payment-gateway';
import { StorageModule } from './storage';
import { UserModule } from 'src/feature/user/user.module';

@Module({
  controllers: [],
  providers: [
    Logger,
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
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 1000,
        },
      ],
    }),
    JwtModule,
    DatabaseModule,
    PaymentGatewayModule,
    StorageModule,
    UserModule,
  ],
  exports: [],
})
export class CoreModule {}
