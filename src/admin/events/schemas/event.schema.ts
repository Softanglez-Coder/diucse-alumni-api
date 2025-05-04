import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MediaRefSchema, MediaRef } from 'src/common/schemas/media-ref.schema';


@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  startAt: Date;

  @Prop()
  endAt: Date;

  @Prop()
  location: string;

  @Prop()
  mapUrl: string;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop()
  onlineUrl: string;

  @Prop()
  fee: number;

  @Prop()
  registrationStartDate: Date;

  @Prop()
  registrationEndDate: Date;

  @Prop({ type: MediaRefSchema })
  poster: MediaRef;
}

export const EventSchema = SchemaFactory.createForClass(Event);
