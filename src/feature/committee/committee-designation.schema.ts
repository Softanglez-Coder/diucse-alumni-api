import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Role } from "@core";

@Schema({
    timestamps: true,
})
export class CommitteeDesignation {
    @Prop({
        required: true,
        type: String,
        unique: true,
    })
    title: string;

    @Prop({
        required: true,
        type: [String],
        enum: Object.values(Role),
        default: [],
    })
    roles: Role[];
}

export const CommitteeDesignationSchema = SchemaFactory.createForClass(CommitteeDesignation);
CommitteeDesignationSchema.plugin(require('mongoose-autopopulate'));

export type CommitteeDesignationDocument = HydratedDocument<CommitteeDesignation>;