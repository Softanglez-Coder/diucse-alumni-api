import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Roles } from 'src/core/decorators';
import { BaseController, Role } from '@core';
import { MembershipService } from './membership.service';
import { MembershipRejectionDto } from './dtos';
import { MembershipDocument } from './membership.schema';
import { RequestExtension } from 'src/core/types';

@Controller('memberships')
export class MembershipController extends BaseController<MembershipDocument> {
  constructor(private readonly membershipService: MembershipService) {
    super(membershipService);
  }

  @Roles(Role.Guest)
  @Post('request')
  async request(@Req() req: RequestExtension) {
    return await this.membershipService.request(req.user?.id);
  }

  @Roles(Role.Reviewer)
  @Patch(':id/in-progress')
  async inReview(@Param('id') id: string) {
    return await this.membershipService.inProgress(id);
  }

  @Roles(Role.Reviewer)
  @Patch(':id/payment-required')
  async paymentRequired(@Param('id') id: string) {
    return await this.membershipService.paymentRequired(id);
  }

  @Roles(Role.Reviewer)
  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return await this.membershipService.approve(id);
  }

  @Roles(Role.Reviewer)
  @Patch(':id/reject')
  async reject(@Param('id') id: string, @Body() dto: MembershipRejectionDto) {
    return await this.membershipService.reject(id, dto.justification);
  }

  @Roles(Role.Guest, Role.Reviewer)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.membershipService.findById(id);
  }
}
