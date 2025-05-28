import { Controller, Get, Patch, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { Role, Roles } from '@core';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {}

  @Roles(
    Role.ADMIN,
    Role.ACCOUNTANT,
    Role.MARKETING_MANAGER,
    Role.SALES_MANAGER,
    Role.EVENT_MANAGER,
    Role.CUSTOMER_SUPPORT,
    Role.PUBLISHER,
    Role.MEMBER,
  )
  @Get(':id')
  async findOne() {}

  @Roles(Role.ADMIN, Role.MEMBER)
  @Patch(':id')
  async update() {}

  @Roles(Role.ADMIN)
  @Patch(':id/block')
  async block() {}

  @Roles(Role.ADMIN)
  @Patch(':id/unblock')
  async unblock() {}

  @Roles(Role.ADMIN)
  @Post(':id/role-assign')
  async assignRole() {}

  @Roles(Role.ADMIN)
  @Post(':id/role-remove')
  async removeRole() {}
}
