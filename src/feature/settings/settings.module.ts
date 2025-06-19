import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Settings, SettingsSchema } from './settings.schema';
import { SettingsController } from './settings.controller';
import { SettingsRepository } from './settings.repository';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Settings.name,
        schema: SettingsSchema,
      }
    ])
  ],
  providers: [
    SettingsRepository,
    SettingsService
  ],
  controllers: [SettingsController],
  exports: [
    SettingsService
  ],
})
export class SettingsModule {}
