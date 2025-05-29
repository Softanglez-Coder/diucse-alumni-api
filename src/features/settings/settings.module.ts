import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './settings.schema';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './settings.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Settings.name,
        schema: SettingsSchema
      }
    ])
  ],
  controllers: [
    SettingsController
  ],
  exports: [
    SettingsService
  ],
  providers: [
    SettingsService,
    SettingsRepository
  ]
})
export class SettingsModule {}
