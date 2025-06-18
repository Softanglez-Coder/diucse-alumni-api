import { Roles, Role, StorageFolder, StorageService, Public } from '@core';
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

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  @Public()
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.filter((user) => user.email !== process.env.BOT_EMAIL);
  }

  @Public()
  @Get(':role')
  async findByRole(@Param('role') role: Role) {
    return await this.userService.findByRole(role);
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
