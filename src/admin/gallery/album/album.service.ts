import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './schemas/album.schema';

@Injectable()
export class AlbumService {
  constructor(@InjectModel(Album.name) private albumModel: Model<Album>) {}

  create(dto: CreateAlbumDto) {
    return this.albumModel.create(dto);
  }

  findAll() {
    return this.albumModel.find();
  }

  findOne(id: string) {
    return this.albumModel.findById(id);
  }

  update(id: string, dto: UpdateAlbumDto) {
    return this.albumModel.findByIdAndUpdate(id, dto, { new: true });
  }

  remove(id: string) {
    return this.albumModel.findByIdAndDelete(id);
  }
}
