import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommitteeDesignationService } from './committee-designation.service';
import { BaseController, Role, Roles, Public } from '@core';
import {
  CreateCommitteeDesignationDto,
  UpdateCommitteeDesignationDto,
  AssignCommitteeMemberDto,
  UnassignCommitteeMemberDto,
} from './dtos';
import { CommitteeDesignationDocument } from './committee-designation.schema';

@Controller('committee-designations')
export class CommitteeDesignationController extends BaseController<CommitteeDesignationDocument> {
  constructor(
    private readonly committeeDesignationService: CommitteeDesignationService,
  ) {
    super(committeeDesignationService);
  }

  @Roles(Role.Admin)
  @Post()
  async createDesignation(@Body() body: CreateCommitteeDesignationDto) {
    return await this.committeeDesignationService.createDesignation(body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateDesignation(
    @Param('id') id: string,
    @Body() body: UpdateCommitteeDesignationDto,
  ) {
    return await this.committeeDesignationService.updateDesignation(id, body);
  }

  @Roles(Role.Admin)
  @Post('members/assign')
  async assignMember(@Body() body: AssignCommitteeMemberDto) {
    return await this.committeeDesignationService.assignMember(body);
  }

  @Roles(Role.Admin)
  @Patch('members/:memberId/unassign')
  async unassignMember(
    @Param('memberId') memberId: string,
    @Body() body: UnassignCommitteeMemberDto,
  ) {
    return await this.committeeDesignationService.unassignMember(
      memberId,
      body,
    );
  }

  @Public()
  @Get('committee/:committeeId')
  async getDesignationsByCommittee(@Param('committeeId') committeeId: string) {
    return await this.committeeDesignationService.getDesignationsByCommittee(
      committeeId,
    );
  }

  @Public()
  @Get('committee/:committeeId/members')
  async getCommitteeMembers(
    @Param('committeeId') committeeId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    return await this.committeeDesignationService.getCommitteeMembers(
      committeeId,
      includeInactiveFlag,
    );
  }

  @Public()
  @Get('committee/:committeeId/structure')
  async getCommitteeStructure(@Param('committeeId') committeeId: string) {
    return await this.committeeDesignationService.getCommitteeStructure(
      committeeId,
    );
  }

  @Public()
  @Get('committee/:committeeId/full')
  async getCommitteeWithMembers(
    @Param('committeeId') committeeId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    return await this.committeeDesignationService.getCommitteeWithMembers(
      committeeId,
      includeInactiveFlag,
    );
  }

  @Roles(Role.Admin, Role.Member)
  @Get('user/:userId/history')
  async getUserCommitteeHistory(
    @Param('userId') userId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    return await this.committeeDesignationService.getUserCommitteeHistory(
      userId,
      includeInactiveFlag,
    );
  }

  @Roles(Role.Admin, Role.Member)
  @Get('user/:userId/roles')
  async getUserActiveRoles(@Param('userId') userId: string) {
    return await this.committeeDesignationService.getUserActiveRoles(userId);
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.committeeDesignationService.findById(id);
  }
}
