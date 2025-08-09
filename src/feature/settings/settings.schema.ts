import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SettingsKey } from './settings-key';

@Schema({
  timestamps: true,
  collection: 'settings',
})
export class Settings<T> {
  @Prop({
    type: String,
    required: true,
    unique: true,
    enum: Object.values(SettingsKey),
  })
  key: SettingsKey;

  @Prop({
    type: String,
    required: true,
    default: null,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: null,
  })
  value: T;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
export type SettingsDocument<T> = HydratedDocument<Settings<T>>;
