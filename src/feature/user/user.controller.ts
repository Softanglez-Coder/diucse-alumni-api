import { Roles, Role, StorageFolder, StorageService } from '@core';
import {
  BadRequestException,
  Body,
  Controller,
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

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  @Roles(Role.Guest)
  async update(
    @Req() req: RequestExtension,
    @Body() body: UpdateUserDto,
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

    const url = await this.storageService.upload(file, StorageFolder.Members);
    if (!url) {
      throw new BadRequestException('File upload failed');
    }

    const updated = await this.userService.update(req.user?.id, {
      photo: url,
    });

    return updated;
  }
}
