import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Settings, SettingsSchema } from './settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Settings.name,
        schema: SettingsSchema,
      }
    ])
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class SettingsModule {}
