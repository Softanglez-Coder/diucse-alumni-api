import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
  Patch,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) { }

  @Post('register')
  async register(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.createMembership(createMembershipDto);
  }

  @Get()
  async getAllMemberships() {
    return this.membershipService.getAllMemberships();
  }

  @Put(':id')
  async updateMembership(
    @Param('id') id: string,
    @Body() updateData: UpdateMembershipDto,
  ) {
    return this.membershipService.updateMembership(id, updateData);
  }

  @Delete(':id')
  async deleteMembership(@Param('id') id: string) {
    return this.membershipService.deleteMembership(id);
  }

  @Patch('approve/:id')
  async approveMembership(@Param('id') id: string) {
    return this.membershipService.approveMembership(id);
  }

  @Patch('reject/:id')
  async rejectMembership(@Param('id') id: string) {
    return this.membershipService.rejectMembership(id);
  }
}