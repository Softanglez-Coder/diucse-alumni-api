import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectModel(Settings.name) private readonly settingsModel: Model<SettingsDocument>
  ) {
  }

  async create(settings: Settings) {
    const created = new this.settingsModel(settings);
    return created.save();
  }

  async findByGroup(group: string) {
    return this.settingsModel.find()
      .where({
        group: group
      })
      .exec()
  }
}