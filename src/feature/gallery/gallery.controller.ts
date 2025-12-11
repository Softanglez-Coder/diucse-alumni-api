import { BaseController, Public, Role, Roles, StorageFolder, StorageService } from '@core';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { GalleryDocument, GalleryCategory } from './gallery.schema';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dtos';

@Controller('gallery')
export class GalleryController extends BaseController<GalleryDocument> {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly storageService: StorageService,
  ) {
    super(galleryService);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: CreateGalleryDto): Promise<GalleryDocument> {
    return this.galleryService.create(body as any);
  }

  @Public()
  @Get('published')
  async getPublished(): Promise<GalleryDocument[]> {
    return this.galleryService.getPublishedGalleries();
  }

  @Public()
  @Get('category/:category')
  async getByCategory(
    @Param('category') category: GalleryCategory,
  ): Promise<GalleryDocument[]> {
    return this.galleryService.getGalleriesByCategory(category);
  }

  @Roles(Role.Admin)
  @Get('all')
  async getAllSorted(): Promise<GalleryDocument[]> {
    return this.galleryService.getAllSorted();
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string): Promise<GalleryDocument> {
    return this.galleryService.findById(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateGalleryDto,
  ): Promise<GalleryDocument> {
    return this.galleryService.update(id, body as any);
  }

  @Roles(Role.Admin)
  @Patch(':id/publish')
  async publish(@Param('id') id: string): Promise<GalleryDocument> {
    return this.galleryService.publish(id);
  }

  @Roles(Role.Admin)
  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string): Promise<GalleryDocument> {
    return this.galleryService.unpublish(id);
  }

  @Roles(Role.Admin)
  @Post(':id/images')
  async addImages(
    @Param('id') id: string,
    @Body() body: { images: Array<{ url: string; thumbnail?: string; caption?: string }> },
  ): Promise<GalleryDocument> {
    return this.galleryService.addImages(id, body.images);
  }

  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('files', 20))
  @Post(':id/images/upload')
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<GalleryDocument> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) =>
      this.storageService.upload(file, StorageFolder.Gallery),
    );

    const urls = await Promise.all(uploadPromises);

    const images = urls.map((url) => ({ url }));

    return this.galleryService.addImages(id, images);
  }

  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/images/upload-single')
  async uploadSingleImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GalleryDocument> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const url = await this.storageService.upload(file, StorageFolder.Gallery);

    if (!url) {
      throw new BadRequestException('File upload failed');
    }

    return this.galleryService.addImages(id, [{ url }]);
  }

  @Roles(Role.Admin)
  @Delete(':id/images')
  async removeImage(
    @Param('id') id: string,
    @Body() body: { imageUrl: string },
  ): Promise<GalleryDocument> {
    return this.galleryService.removeImage(id, body.imageUrl);
  }

  @Roles(Role.Admin)
  @Patch(':id/images/reorder')
  async reorderImages(
    @Param('id') id: string,
    @Body() body: { imageOrders: Array<{ url: string; order: number }> },
  ): Promise<GalleryDocument> {
    return this.galleryService.reorderImages(id, body.imageOrders);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.galleryService.delete(id);
  }
}
