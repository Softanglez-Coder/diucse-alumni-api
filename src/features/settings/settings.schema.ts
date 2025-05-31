import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SettingsGroup } from './enums/settings-group';
import mongoose, { HydratedDocument } from 'mongoose';
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
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: (value: string | number | boolean) => {
        // Allow string, number, or boolean values
        return typeof value === 'string' 
            || typeof value === 'number'
            || typeof value === 'boolean';
      },
      message: 'Value must be a string, number, or boolean',
    },
    required: true,
    default: '',
  })
  value: string | number | boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
export type SettingsDocument = HydratedDocument<Settings>;