import {
  BaseController,
  Public,
  Role,
  Roles,
  StorageFolder,
  StorageService,
} from '@core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BannerDocument } from './banner.schema';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banners')
export class BannerController extends BaseController<BannerDocument> {
  constructor(
    private readonly bannerService: BannerService,
    private readonly storageService: StorageService,
  ) {
    super(bannerService);
  }

  @Roles(Role.Admin, Role.Publisher)
  @Post()
  async create(@Body() dto: CreateBannerDto) {
    return await this.bannerService.create(dto);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.bannerService.findById(id);
  }

  @Roles(Role.Admin, Role.Publisher)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id/image')
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    const url = await this.storageService.upload(file, StorageFolder.Banners);

    if (!url) {
      throw new BadRequestException('File upload failed');
    }

    const updated = await this.bannerService.update(id, {
      image: url,
    });

    return updated;
  }
}
