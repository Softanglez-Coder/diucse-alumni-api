import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { EventDocument } from "./event.schema";
import { Event } from "./event.schema";

@Schema({
    timestamps: true,
})
export class EventCoupon {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Event.name,
        autopopulate: true,
    })
    event: mongoose.Schema.Types.ObjectId | EventDocument;

    @Prop({
        required: true,
        type: Number,
        default: 1,
        min: 1,
    })
    quantity: number;

    @Prop({
        required: true,
        type: Number,
        min: 0,
        default: 0,
    })
    used: number;

    @Prop({
        required: true,
        type: Number,
        min: 0,
        default: 0,
    })
    amount: number;

    @Prop({
        required: true,
        unique: true,
        type: String,
        trim: true,
        maxlength: 100,
        minlength: 1,
    })
    code: string;
}

export const EventCouponSchema = SchemaFactory.createForClass(EventCoupon);
EventCouponSchema.plugin(require('mongoose-autopopulate'));

export type EventCouponDocument = HydratedDocument<EventCoupon>;