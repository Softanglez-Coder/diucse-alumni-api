import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryRepository } from './gallery.repository';
import { GalleryService } from './gallery.service';
import { Gallery, GallerySchema } from './gallery.schema';
import { StorageModule } from '@core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Gallery.name,
        schema: GallerySchema,
      },
    ]),
    StorageModule,
  ],
  providers: [Logger, GalleryService, GalleryRepository],
  controllers: [GalleryController],
  exports: [GalleryService],
})
export class GalleryModule {}
