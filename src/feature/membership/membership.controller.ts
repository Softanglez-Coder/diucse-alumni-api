import { Body, Controller, Get, Header, Headers, Param, Patch, Post, Req } from '@nestjs/common';
import { RequestExtension } from 'src/core/types';
import { Roles } from 'src/core/decorators';
import { Role } from '@core';
import { MembershipService } from './membership.service';
import { MembershipRejectionDto, MembershipUpdateDto } from './dtos';

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

    @Roles(Role.Guest)
    @Patch(':id/request')
    async request(@Param('id') id: string) {
        return await this.membershipService.request(id);
    }

    @Roles(Role.Reviewer)
    @Patch(':id/in-progress')
    async inReview(@Param('id') id: string) {
        return await this.membershipService.inProgress(id);
    }

    @Roles(Role.Reviewer)
    @Patch(':id/approve')
    async approve(@Param('id') id: string) {
        return await this.membershipService.approve(id);
    }

    @Roles(Role.Reviewer)
    @Patch(':id/reject')
    async reject(
        @Param('id') id: string,
        @Body() dto: MembershipRejectionDto
    ) {
        return await this.membershipService.reject(id, dto.justification);
    }


    @Roles(
        Role.Guest,
        Role.Reviewer
    )
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: MembershipUpdateDto
    ) {
        return await this.membershipService.update(id, dto);
    }

    @Roles(
        Role.Guest,
        Role.Reviewer
    )
    @Get(':id')
    async findById( @Param('id') id: string ) {
        return await this.membershipService.findById(id);
    }
}
