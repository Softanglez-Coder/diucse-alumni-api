import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserStatus {
  Pending = 'pending',
  Approved = 'approved',
}

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserStatus, default: UserStatus.Pending })
  status: UserStatus;

  @Prop({ enum: UserRole, default: UserRole.User })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
