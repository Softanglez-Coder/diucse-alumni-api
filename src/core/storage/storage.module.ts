import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Module({
  imports: [],
  controllers: [],
  exports: [StorageService],
  providers: [
    StorageService,
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });

        return cloudinary;
      },
      inject: [ConfigService],
    },
  ],
})
export class StorageModule {}
