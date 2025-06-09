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
    user: UserDocument;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Batch.name,
        autopopulate: true
    })
    batch: BatchDocument

    @Prop({
        required: true,
        type: String,
        enum: Object.values(MembershipStatus),
        default: MembershipStatus.Draft,
    })
    status: MembershipStatus;

    @Prop({
        required: true,
        type: String
    })
    phone: string;

    @Prop({
        type: String,
        required: true
    })
    photo: string;

    @Prop({
        type: String,
        default: ''
    })
    justification?: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.plugin(require('mongoose-autopopulate'));
export type MembershipDocument = HydratedDocument<Membership>;