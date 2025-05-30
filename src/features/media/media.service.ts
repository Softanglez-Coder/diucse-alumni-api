import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StorageService } from '@core';

@Injectable()
export class MediaService {
  constructor(private readonly storageService: StorageService) {}

  async upload(file: Express.Multer.File) {
    const url = await this.storageService.upload(file);

    if (!url) {
      throw new HttpException(
        'URL not found after uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return url;
  }
}
