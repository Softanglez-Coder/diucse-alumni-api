import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public, Role, Roles } from '@core';
import { CreateSettingsDto } from './dtos';
import { SettingsService } from './settings.service';
import { SettingsGroup } from './enums';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {
  }

  @Roles(Role.SuperAdmin, Role.Admin)
  @Post()
  async create(@Body() body: CreateSettingsDto) {
    return await this.settingsService.create(body);
  }

  @Public()
  @Get(':group')
  async findByGroup(@Param('group') group: string) {
    return await this.settingsService.findByGroup(group as SettingsGroup);
  }
}