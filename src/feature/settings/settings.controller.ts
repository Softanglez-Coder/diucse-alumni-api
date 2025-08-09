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
import { SettingsKey } from './settings-key';
import { BaseController, Public, Role, Roles } from '@core';
import { SettingsDocument } from './settings.schema';

@Controller('settings')
export class SettingsController extends BaseController<SettingsDocument<any>> {
  constructor(private readonly settingsService: SettingsService<any>) {
    super(settingsService);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: any) {
    return await this.settingsService.create(body);
  }

  @Public()
  @Get('keys/:key')
  async findByKey(@Param('key') key: SettingsKey) {
    return await this.settingsService.findByProperty('key', key);
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
}
