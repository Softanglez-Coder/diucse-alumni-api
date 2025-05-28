import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { MembershipRequestDto, MembershipRequestUpdateDto } from './dto';
import { MembershipService } from './membership.service';
import { Request } from 'express';
import { Public, Role, Roles } from '@core';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Post('create-user')
  async createUser(@Body() body: { membershipId: string }) {
    const { membershipId } = body;
    return await this.membershipService.createUser(membershipId);
  }

  @Public()
  @Post('request')
  async request(@Body() dto: MembershipRequestDto) {
    return await this.membershipService.request(dto);
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Get('pendings')
  async findPendings() {
    return await this.membershipService.findPendings();
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Get('in-progress')
  async findInProgress() {
    return await this.membershipService.findInProgress();
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Get('validated')
  async findValidated() {
    return await this.membershipService.findValidated();
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Get('approved')
  async findApproved() {
    return await this.membershipService.findApproved();
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Get('rejected')
  async findRejected() {
    return await this.membershipService.findRejected();
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Get(':id')
  async findById(@Param('id') id: string) {
    console.log(`Finding membership by ID: ${id}`);
    return await this.membershipService.findById(id);
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: MembershipRequestUpdateDto,
  ) {
    return await this.membershipService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Patch(':id/in-progress')
  async inProgress(@Param('id') id: string) {
    return await this.membershipService.inProgress(id);
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Patch(':id/validate')
  async validate(@Param('id') id: string) {
    return await this.membershipService.validate(id);
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return await this.membershipService.approve(id);
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Patch(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body('justification') justification: string,
  ) {
    if (!justification || justification.trim() === '') {
      throw new BadRequestException('Justification is required for rejection');
    }

    return await this.membershipService.reject(id, justification);
  }

  @Public()
  @Post(':id/pay')
  async pay(@Param('id') id: string, @Req() req: Request) {
    const host = `${req.protocol}://${req.get('host')}`;
    if (req.get('port')) {
      host.concat(`:${req.get('port')}`);
    }

    return await this.membershipService.pay(host, id);
  }
}
