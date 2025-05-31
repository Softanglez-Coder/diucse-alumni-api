import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { CreateSettingsDto } from './dtos';
import { SettingsGroup } from './enums';

@Injectable()
export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository
  ) {
  }

  async create(settings: CreateSettingsDto) {
    return await this.settingsRepository.create(settings);
  }

  async findByGroup(group: SettingsGroup) {
    const settings = await this.settingsRepository.findByGroup(group);

    if (!settings || settings.length === 0) {
      return {
        group: group,
        settings: {}
      };
    }

    const values = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    return { group, values };
  }
}