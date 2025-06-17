import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RequestExtension } from 'src/core/types';
import { Roles } from 'src/core/decorators';
import { Role, StorageFolder, StorageService } from '@core';
import { MembershipService } from './membership.service';
import { MembershipRejectionDto, MembershipUpdateDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly storageService: StorageService,
  ) {}

  @Roles(Role.Guest)
  @Post('enroll')
  async enroll(@Req() req: RequestExtension) {
    const user = req.user;
    return await this.membershipService.enroll(user.id);
  }

  @Roles(Role.Guest)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id/photo')
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    const url = await this.storageService.upload(file, StorageFolder.Members);
    if (!url) {
      throw new BadRequestException('File upload failed');
    }

    const updated = await this.membershipService.update(id, {
      photo: url,
    });

    return updated;
  }

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
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: MembershipUpdateDto) {
    return await this.membershipService.update(id, dto);
  }

  @Roles(Role.Guest, Role.Reviewer)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.membershipService.findById(id);
  }
}
