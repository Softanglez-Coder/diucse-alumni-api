import { Body, Controller, Header, Headers, Param, Patch, Post, Req } from '@nestjs/common';
import { MembershipApplicationDto } from './dtos';
import { RequestExtension } from 'src/core/types';

@Controller('membership')
export class MembershipController {
    @Post('apply')
    async apply(@Req() req: RequestExtension) {
        const user = req.user;
    }

    @Patch(':id/update')
    async update(
        @Param('id') id: string,
        @Body() dto: MembershipApplicationDto
    ) {}

    @Post(':id/confirm')
    async confirm(@Param('id') id: string) {}
}
