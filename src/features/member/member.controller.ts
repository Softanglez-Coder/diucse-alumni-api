import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { Public, Role, Roles } from '@core';
import { UpdateMemberDto } from './dtos';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Public()
  @Get()
  async findAll() {
    return await this.memberService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.memberService.findById(id);
  }

  @Roles(Role.ADMIN, Role.MEMBER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateMemberDto) {
    return await this.memberService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/block')
  async block(
    @Param('id') id: string,
    @Body('justification') justification?: string,
  ) {
    return await this.memberService.block(id, justification);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/unblock')
  async unblock(
    @Param('id') id: string,
    @Body('justification') justification?: string,
    ) {
    return await this.memberService.unblock(id, justification);
  }

  @Roles(Role.ADMIN)
  @Post(':id/roles-assign')
  async assignRoles(
    @Param('id') id: string,
    @Body('roles') roles: Role[],
  ) {
    return await this.memberService.assignRoles(id, roles);
  }

  @Roles(Role.ADMIN)
  @Post(':id/roles-remove')
  async removeRoles(
    @Param('id') id: string,
    @Body('roles') roles: Role[]
  ) {
    return await this.memberService.removeRoles(id, roles);
  }
}
