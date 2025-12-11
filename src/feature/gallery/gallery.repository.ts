import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Gallery, GalleryDocument, GalleryCategory } from './gallery.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GalleryRepository extends BaseRepository<GalleryDocument> {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,
  ) {
    super(galleryModel);
  }

  async findPublished(): Promise<GalleryDocument[]> {
    return this.galleryModel
      .find({ isPublished: true })
      .sort({ order: 1, date: -1 })
      .exec();
  }

  async findByCategory(category: GalleryCategory): Promise<GalleryDocument[]> {
    return this.galleryModel
      .find({ isPublished: true, category })
      .sort({ order: 1, date: -1 })
      .exec();
  }

  async findAllSorted(): Promise<GalleryDocument[]> {
    return this.galleryModel.find().sort({ order: 1, date: -1 }).exec();
  }
}
