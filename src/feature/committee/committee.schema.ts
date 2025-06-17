import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,
})
export class Committee {
    @Prop({
        required: true,
        type: String,
    })
    name: string;

    @Prop({
        required: true,
        type: String,
    })
    start: string;

    @Prop({
        required: true,
        type: String,
    })
    end: string;
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
CommitteeSchema.plugin(require('mongoose-autopopulate'));

export type CommitteeDocument = HydratedDocument<Committee>;