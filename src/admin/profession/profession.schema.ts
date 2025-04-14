import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfessionDocument = Profession & Document;

@Schema()
export class Profession {
    @Prop({ required: true, unique: true })
    name: string;
}

export const ProfessionSchema = SchemaFactory.createForClass(Profession);
