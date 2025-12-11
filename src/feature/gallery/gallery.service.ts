import { BaseService } from '@core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GalleryDocument, GalleryCategory } from './gallery.schema';
import { GalleryRepository } from './gallery.repository';
import { CreateGalleryDto, UpdateGalleryDto } from './dtos';

@Injectable()
export class GalleryService extends BaseService<GalleryDocument> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly logger: Logger,
  ) {
    super(galleryRepository);
  }

  async getPublishedGalleries(): Promise<GalleryDocument[]> {
    this.logger.log('Fetching published galleries');
    return this.galleryRepository.findPublished();
  }

  async getGalleriesByCategory(
    category: GalleryCategory,
  ): Promise<GalleryDocument[]> {
    this.logger.log(`Fetching galleries for category: ${category}`);
    return this.galleryRepository.findByCategory(category);
  }

  async getAllSorted(): Promise<GalleryDocument[]> {
    this.logger.log('Fetching all galleries sorted');
    return this.galleryRepository.findAllSorted();
  }

  async publish(id: string): Promise<GalleryDocument> {
    this.logger.log(`Publishing gallery with id: ${id}`);

    const gallery = await this.galleryRepository.findById(id);
    if (!gallery) {
      this.logger.error(`Gallery with id ${id} not found`);
      throw new NotFoundException(`Gallery with id ${id} not found`);
    }

    gallery.isPublished = true;
    return await this.galleryRepository.update(id, gallery);
  }

  async unpublish(id: string): Promise<GalleryDocument> {
    this.logger.log(`Unpublishing gallery with id: ${id}`);

    const gallery = await this.galleryRepository.findById(id);
    if (!gallery) {
      this.logger.error(`Gallery with id ${id} not found`);
      throw new NotFoundException(`Gallery with id ${id} not found`);
    }

    gallery.isPublished = false;
    return await this.galleryRepository.update(id, gallery);
  }

  async addImages(
    id: string,
    images: Array<{ url: string; thumbnail?: string; caption?: string }>,
  ): Promise<GalleryDocument> {
    this.logger.log(`Adding images to gallery with id: ${id}`);

    const gallery = await this.galleryRepository.findById(id);
    if (!gallery) {
      this.logger.error(`Gallery with id ${id} not found`);
      throw new NotFoundException(`Gallery with id ${id} not found`);
    }

    const currentMaxOrder = gallery.images.length > 0 
      ? Math.max(...gallery.images.map(img => img.order || 0))
      : -1;

    const newImages = images.map((img, index) => ({
      ...img,
      order: currentMaxOrder + index + 1,
    }));

    gallery.images.push(...newImages);
    return await this.galleryRepository.update(id, gallery);
  }

  async removeImage(id: string, imageUrl: string): Promise<GalleryDocument> {
    this.logger.log(`Removing image from gallery with id: ${id}`);

    const gallery = await this.galleryRepository.findById(id);
    if (!gallery) {
      this.logger.error(`Gallery with id ${id} not found`);
      throw new NotFoundException(`Gallery with id ${id} not found`);
    }

    gallery.images = gallery.images.filter(img => img.url !== imageUrl);
    return await this.galleryRepository.update(id, gallery);
  }

  async reorderImages(
    id: string,
    imageOrders: Array<{ url: string; order: number }>,
  ): Promise<GalleryDocument> {
    this.logger.log(`Reordering images for gallery with id: ${id}`);

    const gallery = await this.galleryRepository.findById(id);
    if (!gallery) {
      this.logger.error(`Gallery with id ${id} not found`);
      throw new NotFoundException(`Gallery with id ${id} not found`);
    }

    imageOrders.forEach(({ url, order }) => {
      const image = gallery.images.find(img => img.url === url);
      if (image) {
        image.order = order;
      }
    });

    return await this.galleryRepository.update(id, gallery);
  }
}
