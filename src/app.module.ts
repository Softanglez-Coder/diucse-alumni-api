import { Module } from '@nestjs/common';
import { CoreModule } from './core';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
      CoreModule,
      UploadModule
  ],
})
export class AppModule {}
