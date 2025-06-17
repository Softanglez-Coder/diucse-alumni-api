import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,
})
export class Event {
    @Prop({
        required: true,
        type: String,
    })
    title: string;

    @Prop({
        required: true,
        type: Number,
    })
    fee: number;

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

    @Prop({
        type: String,
    })
    description?: string;

    @Prop({
        required: true,
        type: String,
        default: 'STC, Dhaka International University'
    })
    location?: string;

    @Prop({
        type: String,
        default: 'https://maps.app.goo.gl/BmB3utJyuA1xxYNg6',
        required: true,
    })
    mapLocation?: string;

    @Prop({
        type: String,
    })
    banner?: string;

    @Prop({
        type: Number,
        default: 0,
    })
    capacity?: number;

    @Prop({
        type: Boolean,
        default: false,
    })
    open?: boolean;

    @Prop({
        type: String,
    })
    justificationOfClosing?: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    published?: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.plugin(require('mongoose-autopopulate'));

export type EventDocument = HydratedDocument<Event>;