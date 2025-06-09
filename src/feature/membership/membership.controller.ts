import { Body, Controller, Get, Header, Headers, Param, Patch, Post, Req } from '@nestjs/common';
import { RequestExtension } from 'src/core/types';
import { Roles } from 'src/core/decorators';
import { Role } from '@core';
import { MembershipService } from './membership.service';
import { MembershipUpdateDto } from './dtos';

@Controller('membership')
export class MembershipController {
    constructor(
        private readonly membershipService: MembershipService
    ) {}

    @Roles(Role.Guest)
    @Post('enroll')
    async enroll(@Req() req: RequestExtension) {
        const user = req.user;
        return await this.membershipService.enroll(user.id);
    }

    @Post(':id/apply')
    async apply(@Param('id') id: string) {}

    @Roles(
        Role.Guest,
        Role.SuperAdmin,
        Role.Admin,
        Role.Reviewer
    )
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: MembershipUpdateDto
    ) {
        return await this.membershipService.update(id, dto);
    }

    @Get(':id')
    async findById( @Param('id') id: string ) {
        return await this.membershipService.findById(id);
    }
}
