import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
    status: string;

    @Prop()
    resetToken?: string;

    @Prop()
    resetTokenExpiry?: Date;

    @Prop({ default: false })
    isApproved: boolean;

    @Prop({ enum: Role, default: Role.User })
    role: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);
