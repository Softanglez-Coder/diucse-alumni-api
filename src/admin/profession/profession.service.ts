import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profession, ProfessionDocument } from './profession.schema';
import { CreateProfessionDto } from './profession.dto';

@Injectable()
export class ProfessionService {
    constructor(
        @InjectModel(Profession.name) private professionModel: Model<ProfessionDocument>,
    ) { }

    async create(dto: CreateProfessionDto): Promise<Profession> {
        const created = new this.professionModel(dto);
        return created.save();
    }

    async findAll(): Promise<Profession[]> {
        return this.professionModel.find().exec();
    }

    async delete(id: string) {
        return this.professionModel.findByIdAndDelete(id);
    }
}
