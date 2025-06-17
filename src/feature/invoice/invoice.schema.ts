import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User, UserDocument } from "../user";
import mongoose, { HydratedDocument } from "mongoose";
import { InvoiceStatus } from "./invoice-status";
import { InvoiceRemarks } from "./invoice-remarks";

@Schema({
    timestamps: true,
    collection: 'invoices',
})
export class Invoice {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        autopopulate: true
    })
    user: UserDocument | mongoose.Schema.Types.ObjectId;

    @Prop({
        required: true,
        type: Number,
        min: 1
    })
    amount: number;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(InvoiceStatus),
        default: InvoiceStatus.Unpaid
    })
    status?: InvoiceStatus;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(InvoiceRemarks),
    })
    remarks: InvoiceRemarks;

    @Prop({
        type: String,
        default: ''
    })
    paymentUrl?: string;

    @Prop({
        type: String,
        default: ''
    })
    validationId?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.plugin(require('mongoose-autopopulate'));
export type InvoiceDocument = HydratedDocument<Invoice>;