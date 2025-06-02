import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateMemberRequest } from "../member/requests";
import { MemberService } from "@member";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly memberService: MemberService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: CreateMemberRequest) {
        const member = await this.memberService.create(dto);
        return { id: member.id };
    }

    async login(email: string, password: string) {
        const member = await this.memberService.findByEmail(email, true);
        if (!member) {
            throw new UnauthorizedException("Member not found");
        }

        const isPasswordValid = bcrypt.compareSync(password, member.hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }

        const payload = {
            sub: member.id,
            email: member.email,
            blocked: member.blocked,
            roles: member.roles,
        };

        const token = this.jwtService.sign(payload);
        return { accessToken: token };
    }

    async me(memberId: string) {
        const member = await this.memberService.findById(memberId);
        if (!member) {
            throw new NotFoundException("Member not found");
        }

        return member;
    }
}