import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';
import { Public } from '@core';

@Controller('member')
export class MemberController {
    constructor(
        private readonly memberService: MemberService
    ) {}

    @Public()
    @Get()
    async findAll() {
        return await this.memberService.findAll();
    }
}
