import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Settings, SettingsDocument } from './settings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SettingsRepository<T> extends BaseRepository<SettingsDocument<T>> {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument<T>>,
  ) {
    super(settingsModel);
  }
}
