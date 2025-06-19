import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { SettingsDocument } from './settings.schema';
import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingsService<T> extends BaseService<SettingsDocument<T>> {
  constructor(private readonly settingsRepository: SettingsRepository<T>) {
    super(settingsRepository);
  }
}
