import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/core/role';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  hash: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  blocked: boolean;

  @Prop({
    type: String,
    default: null
  })
  blockedJustification: string;

  @Prop({
    type: String,
    default: null
  })
  unblockedJustification: string;

  @Prop({
    type: [String],
    required: true,
    enum: Object.values(Role),
    default: [Role.MEMBER],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
