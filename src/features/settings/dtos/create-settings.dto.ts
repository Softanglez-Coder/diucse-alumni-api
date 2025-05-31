import { SettingsGroup } from '../enums';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { SettingsKey } from '../enums/settings-key';

export class CreateSettingsDto {
  @IsEnum(SettingsGroup)
  group: SettingsGroup;

  @IsString()
  key: SettingsKey;

  @IsDefined()
  value: string | number | boolean;
}