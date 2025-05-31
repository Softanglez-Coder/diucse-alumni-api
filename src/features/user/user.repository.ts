import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    async findById(id: string): Promise<UserDocument | null> {
        return await this.userModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ username }).exec();
    }

    async create(payload: User) {
        const user = new this.userModel(payload);
        return await user.save();
    }
}