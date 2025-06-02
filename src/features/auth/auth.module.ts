import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MemberModule, MemberService } from "@member";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync({
             imports: [ConfigModule],
             useFactory: async (configService: ConfigService) => ({
               secret: configService.get<string>('JWT_SECRET'),
               signOptions: { expiresIn: '1d' },
             }),
             inject: [ConfigService],
           }),
        MemberModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
    ],
})
export class AuthModule {}