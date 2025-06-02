import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateMemberRequest } from "../member/requests";
import { Public, RequestExtension } from "@core";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() body: CreateMemberRequest) {
        return this.authService.register(body);
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('login')
    async login(@Body() body: { email: string; password: string; }) {
        const { email, password } = body;
        return this.authService.login(email, password);
    }

    @HttpCode(HttpStatus.OK)
    @Get('me')
    async me(@Req() req: RequestExtension) {
        return await this.authService.me(req.member?.id);
    }
}