import { Role } from '@core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
  })
  email: string;

  @Prop({
    required: true,
    select: false
  })
  password?: string;

  @Prop({
    type: [String],
    enum: Object.values(Role),
    default: [Role.Guest],
  })
  roles?: Role[];

  @Prop({
    type: String,
    default: '',
  })
  name?: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  active?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
