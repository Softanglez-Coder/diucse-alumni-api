import { BaseRepository } from "@core";
import { Injectable } from "@nestjs/common";
import { Banner, BannerDocument } from "./banner.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BannerRepository extends BaseRepository<BannerDocument> {
    constructor(
        @InjectModel(Banner.name) private readonly bannerModel: Model<BannerDocument>
    ) {
        super(bannerModel);
    }
}