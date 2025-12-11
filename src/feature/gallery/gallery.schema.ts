import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum GalleryCategory {
  EVENTS = 'events',
  ACTIVITIES = 'activities',
  ACHIEVEMENTS = 'achievements',
  GENERAL = 'general',
}

@Schema({ _id: false })
export class GalleryImage {
  @Prop({ required: true, type: String })
  url: string;

  @Prop({ type: String, default: '' })
  thumbnail?: string;

  @Prop({ type: String, default: '' })
  caption?: string;

  @Prop({ type: Number, default: 0 })
  order: number;
}

export const GalleryImageSchema = SchemaFactory.createForClass(GalleryImage);

@Schema({
  timestamps: true,
  collection: 'galleries',
})
export class Gallery {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(GalleryCategory),
    default: GalleryCategory.GENERAL,
  })
  category: GalleryCategory;

  @Prop({
    type: [GalleryImageSchema],
    default: [],
  })
  images: GalleryImage[];

  @Prop({
    type: Date,
    default: Date.now,
  })
  date: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPublished: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  order: number;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

export type GalleryDocument = HydratedDocument<Gallery>;
