import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsGroup } from './settings-group';
import { SettingsKey } from './settings-key';
import { Public, Role, Roles } from '@core';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService<any>) {}

  @Public()
  @Get()
  async findAll() {
    return await this.settingsService.findAll();
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: any) {
    return await this.settingsService.create(body);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.settingsService.findById(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.settingsService.update(id, body);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.settingsService.delete(id);
  }

  @Public()
  @Get(':group')
  async findByGroup(@Param('group') group: SettingsGroup) {
    return await this.settingsService.findByProperty('group', group);
  }

  @Public()
  @Get(':key')
  async findByKey(@Param('key') key: SettingsKey) {
    return await this.settingsService.findByProperty('key', key);
  }
}
