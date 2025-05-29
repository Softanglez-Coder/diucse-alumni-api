import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SettingsGroup } from './enums/settings-group';
import { HydratedDocument } from 'mongoose';
import { SettingsKey } from './enums';

@Schema({
  timestamps: true
})
export class Settings {
  @Prop({
    required: true,
    type: String,
    enum: Object.values(SettingsGroup),
    index: true,
    trim: true,
  })
  group: SettingsGroup;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(SettingsKey),
    index: true,
    trim: true,
  })
  key: SettingsKey;

  @Prop({
    required: true,
    type: String,
    trim: true,
    default: '',
  })
  value: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
export type SettingsDocument = HydratedDocument<Settings>;