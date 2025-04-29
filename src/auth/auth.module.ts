import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schema/user.schema';
import { EmailService } from './email.service';
import { EmailModule } from 'src/email/email.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { AdminController } from './admin.controller';
import { ForgotPasswordController } from './forgot-password.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'defaultSecret',
            signOptions: { expiresIn: '1d' },
        }),
        EmailModule,
    ],
    controllers: [AuthController, AdminController, ForgotPasswordController],
    providers: [AuthService, EmailService, JwtStrategy, RolesGuard],
    exports: [AuthService],
})
export class AuthModule { }

