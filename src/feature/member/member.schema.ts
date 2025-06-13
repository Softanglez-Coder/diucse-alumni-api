import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User, UserDocument } from "../user";
import { Membership, MembershipDocument } from "../membership/membership.schema";

@Schema({
    timestamps: true,
})
export class Member {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Membership.name,
        required: true,
        index: true,
        autopopulate: true,
    })
    membership: mongoose.Schema.Types.ObjectId | MembershipDocument;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.plugin(require('mongoose-autopopulate'));
export type MemberDocument = HydratedDocument<Member>;