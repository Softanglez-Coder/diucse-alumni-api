import {
  Roles,
  Role,
  StorageFolder,
  StorageService,
  Public,
  BaseController,
} from '@core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { RequestExtension } from 'src/core/types';
import { UpdateUserDto } from './dtos';
import { UserDocument } from './user.schema';

@Controller('users')
export class UserController extends BaseController<UserDocument> {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {
    super(userService);
  }

  @Public()
  @Get('members')
  async getMembers() {
    return await this.userService.findByRole(Role.Member);
  }

  @Public()
  @Get('membership/:membershipId')
  async findByMembershipId(@Param('membershipId') membershipId: string) {
    return await this.userService.findByMembershipId(membershipId);
  }

  @Roles(Role.Admin)
  @Get('all/with-roles')
  async getAllWithRoles() {
    return await this.userService.findAllWithRoles();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Public()
  @Get(':id/with-roles')
  async findByIdWithRoles(@Param('id') id: string) {
    return await this.userService.findByIdWithAllRoles(id);
  }

  @Roles(Role.Guest)
  @Patch()
  async update(
    @Req() req: RequestExtension,
    @Body() body: Partial<UpdateUserDto>,
  ) {
    const updated = await this.userService.update(req.user?.id, body);
    return updated;
  }

  @Roles(Role.Guest)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('photo')
  async upload(
    @Req() req: RequestExtension,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    const url = await this.storageService.upload(file, StorageFolder.Users);
    if (!url) {
      throw new BadRequestException('File upload failed');
    }

    const updated = await this.userService.update(req.user?.id, {
      photo: url,
    });

    return updated;
  }
}
