import { InjectModel } from "@nestjs/mongoose";
import { Token, TokenDocument } from "./token.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenRepository {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>
    ) {}

    async store(username: string, token: string): Promise<TokenDocument> {
        const newToken = new this.tokenModel({
            username: username,
            token: token
        });
        return await newToken.save();
    }
    async findByToken(token: string): Promise<TokenDocument | null> {
        return await this.tokenModel.findOne({ token: token }).exec();
    }

    async invalidate(token: string): Promise<void> {
        await this.tokenModel.deleteOne({ token: token }).exec();
    }

    async findByUsername(username: string): Promise<TokenDocument[]> {
        return await this.tokenModel.find({ username: username }).exec();
    }

    async invalidateByUsername(username: string): Promise<void> {
        await this.tokenModel.deleteMany({ username: username }).exec();
    }

    async invalidateAll(): Promise<void> {
        await this.tokenModel.deleteMany({}).exec();
    }
}