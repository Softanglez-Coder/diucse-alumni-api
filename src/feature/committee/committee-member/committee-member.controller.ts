import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CommitteeMemberService } from './committee-member.service';
import { BaseController, Role, Roles } from '@core';
import { CreateCommitteeMemberDto, UpdateCommitteeMemberDto } from './dtos';
import { CommitteeMemberDocument } from './committee-member.schema';

@Controller('committee-members')
export class CommitteeMemberController extends BaseController<CommitteeMemberDocument> {
  constructor(private readonly committeeMemberService: CommitteeMemberService) {
    super(committeeMemberService);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() dto: CreateCommitteeMemberDto) {
    return this.committeeMemberService.create(dto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<UpdateCommitteeMemberDto>,
  ) {
    return this.committeeMemberService.update(id, dto);
  }
}
