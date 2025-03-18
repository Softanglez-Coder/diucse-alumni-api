import { Module } from '@nestjs/common';
import { CoreModule } from './core';
import { BlogsModule } from './blogs/blogs.module';


@Module({
  imports: [
      CoreModule,
      BlogsModule,
  ],
})
export class AppModule {}


