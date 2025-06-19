import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Roles } from 'src/core/decorators';
import { Role, StorageService } from '@core';
import { MembershipService } from './membership.service';
import { MembershipRejectionDto } from './dtos';

@Controller('memberships')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly storageService: StorageService,
  ) {}

  @Roles(Role.Guest)
  @Post(':id/request')
  async request(@Param('id') id: string) {
    return await this.membershipService.request(id);
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
