import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { StorageFolder } from './storage-folder';

@Injectable()
export class StorageService {
  constructor(@Inject('CLOUDINARY') private client: typeof cloudinary) {}

  async upload(file: Express.Multer.File, folder: StorageFolder): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const stream = Readable.from(file.buffer);
    
    return new Promise<string>((resolve, reject) => {
      const uploadStream = this.client.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: folder,
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            return reject(error);
          }

          resolve(result.secure_url);
        },
      );

      stream.pipe(uploadStream);
    });
  }

  async delete(url: string): Promise<void> {
    if (!url) {
      throw new BadRequestException('No URL provided');
    }

    const publicId = url.split('/').slice(-1)[0].split('.')[0];
    if (!publicId) {
      throw new BadRequestException('Invalid URL format');
    }

    return new Promise<void>((resolve, reject) => {
      this.client.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }

        if (result.result !== 'ok') {
          return reject(new Error('Failed to delete file'));
        }

        resolve();
      });
    });
  }
}
