import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { StorageModule } from '@core';

@Module({
  imports: [StorageModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
