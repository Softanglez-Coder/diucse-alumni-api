import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profession, ProfessionSchema } from './profession.schema';
import { ProfessionService } from './profession.service';
import { ProfessionController } from './profession.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Profession.name, schema: ProfessionSchema }])],
    providers: [ProfessionService],
    controllers: [ProfessionController],
})
export class ProfessionModule { }
