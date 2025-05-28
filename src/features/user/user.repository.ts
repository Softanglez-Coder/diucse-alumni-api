import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(email: string, hash: string) {
    const user = new this.userModel({ email, hash });
    return await user.save();
  }

  async findByUsername(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async updatePassword(id: string, hash: string): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, { hash }, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }
}
