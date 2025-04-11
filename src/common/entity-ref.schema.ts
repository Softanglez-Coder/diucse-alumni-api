import { Prop } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export class EntityRef {
    @Prop()
    @IsString()
    id: string;

    @Prop()
    @IsString()
    name: string;
}
