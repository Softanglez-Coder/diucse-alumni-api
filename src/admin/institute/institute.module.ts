import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Institute, InstituteSchema } from './institute.schema';
import { InstituteService } from './institute.service';
import { InstituteController } from './institute.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Institute.name, schema: InstituteSchema }])],
    providers: [InstituteService],
    controllers: [InstituteController],
})
export class InstituteModule { }
