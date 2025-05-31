import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "src/core/role";

@Schema({
    timestamps: true,
    collection: 'users',
})
export class User {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_.-]+$/,
        lowercase: true,
        index: true,
        immutable: true,
    })
    username: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    })
    email: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    isEmailVerified: boolean;

    @Prop({
        type: String,
        required: true,
    })
    hash: string;

    @Prop({
        type: Boolean,
        default: true,
    })
    isActive: boolean;

    @Prop({
        type: [String],
        enum: Object.values(Role),
        default: [Role.Guest],
    })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;