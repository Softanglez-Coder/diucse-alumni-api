import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,
    collection: 'banners'
})
export class Banner {
    @Prop({
        required: true,
        type: String
    })
    title: string;

    @Prop({
        type: String,
        required: false
    })
    description: string;

    @Prop({
        type: String,
        required: false,
        default: ''
    })
    image: string;

    @Prop({
        type: String,
        required: false
    })
    link: string;

    @Prop({
        type: Boolean,
        default: true
    })
    active: boolean;

    @Prop({
        type: Number,
        default: 0
    })
    order: number;
}

export type BannerDocument = HydratedDocument<Banner>;
export const BannerSchema = SchemaFactory.createForClass(Banner);