import { SettingsGroup } from '../enums';
import { IsEnum, IsString } from 'class-validator';
import { SettingsKey } from '../enums/settings-key';

export class CreateSettingsDto {
  @IsEnum(SettingsGroup)
  group: SettingsGroup;

  @IsString()
  key: SettingsKey;

  @IsString()
  value: string;
}