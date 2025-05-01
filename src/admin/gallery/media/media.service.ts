import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(@InjectModel(Media.name) private mediaModel: Model<Media>) {}

  create(dto: CreateMediaDto) {
    return this.mediaModel.create(dto);
  }

  findAll() {
    return this.mediaModel.find().populate('album');
  }

  findOne(id: string) {
    return this.mediaModel.findById(id).populate('album');
  }

  update(id: string, dto: UpdateMediaDto) {
    return this.mediaModel.findByIdAndUpdate(id, dto, { new: true });
  }

  remove(id: string) {
    return this.mediaModel.findByIdAndDelete(id);
  }
}
