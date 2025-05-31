import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,
    collection: 'tokens',
})
export class Token {
    @Prop({
        required: true,
        type: String,
        index: true,
    })
    username: string;
    
    @Prop({
        required: true,
        unique: true,
        type: String,
        index: true,
    })
    token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export type TokenDocument = HydratedDocument<Token>;