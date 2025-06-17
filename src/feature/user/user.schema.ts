import { Role } from '@core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Batch, BatchDocument } from '../batch/batch.schema';

@Schema({
  timestamps: true,
  collection: 'users',
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
    select: false,
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

  @Prop({
    type: Boolean,
    default: false,
  })
  emailVerified?: boolean;

  @Prop({
      type: mongoose.Schema.Types.ObjectId,
      ref: Batch.name,
      autopopulate: true,
      default: null,
    })
    batch?: BatchDocument | mongoose.Schema.Types.ObjectId;
  
    @Prop({
      type: String,
      default: null,
    })
    phone?: string;
  
    @Prop({
      type: String,
      default: null,
    })
    photo?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
