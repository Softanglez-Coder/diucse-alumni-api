import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommitteeMemberService } from './committee-member.service';
import { Public, Role, Roles } from '@core';
import { CreateCommitteeMemberDto, UpdateCommitteeMemberDto } from './dtos';

@Controller('committee-members')
export class CommitteeMemberController {
  constructor(
    private readonly committeeMemberService: CommitteeMemberService,
  ) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() dto: CreateCommitteeMemberDto) {
    return this.committeeMemberService.create(dto);
  }

  @Public()
  @Get()
  async findAll() {
    return this.committeeMemberService.findAll();
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
