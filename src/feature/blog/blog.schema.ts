import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User, UserDocument } from "../user";
import { Member, MemberDocument } from "../member/member.schema";

@Schema({
    timestamps: true,
    collection: 'blogs',
})
export class Blog {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Member.name,
        autopopulate: true
    })
    author: mongoose.Schema.Types.ObjectId | MemberDocument;

    @Prop({
        required: true,
        type: String,
    })
    title: string;

    @Prop({
        required: true,
        type: String,
    })
    content: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    published?: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.plugin(require('mongoose-autopopulate'));

export type BlogDocument = HydratedDocument<Blog>;