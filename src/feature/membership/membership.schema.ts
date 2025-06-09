import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User, UserDocument } from "../user";
import { MembershipStatus } from "./membership-status";
import { Batch, BatchDocument } from "../batch/batch.schema";

@Schema({
    timestamps: true
})
export class Membership {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        autopopulate: true
    })
    user: UserDocument | mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Batch.name,
        autopopulate: true,
        default: null
    })
    batch?: BatchDocument | mongoose.Schema.Types.ObjectId;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(MembershipStatus),
        default: MembershipStatus.Draft,
    })
    status?: MembershipStatus;

    @Prop({
        type: String,
        default: null
    })
    phone?: string;

    @Prop({
        type: String,
        default: null
    })
    photo?: string;

    @Prop({
        type: String,
        default: null
    })
    justification?: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.plugin(require('mongoose-autopopulate'));
export type MembershipDocument = HydratedDocument<Membership>;