import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MembershipStatus } from "./enums";
import { Role } from "src/core/role";

@Schema({
    timestamps: true,
    collection: 'members',
})
export class Member {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        trim: true
    })
    phone: string;

    @Prop({
        type: String,
        required: true,
        trim: true
    })
    name: string;

    @Prop({
        type: [String],
        enum: Object.values(Role),
        default: [Role.Guest],
    })
    roles?: Role[];

    @Prop({
        type: String,
        required: true,
        enum: Object.values(MembershipStatus),
        default: MembershipStatus.Draft,
    })
    status?: MembershipStatus;

    @Prop({
        type: String,
        default: null
    })
    rejectionReason?: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    blocked?: boolean;

    @Prop({
        type: String,
        select: false,
        required: true
    })
    hash: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
export type MemberDocument = HydratedDocument<Member>;

MemberSchema.plugin(require("mongoose-autopopulate"));