import { BaseService } from "@core";
import { Injectable } from "@nestjs/common";
import { BannerRepository } from "./banner.repository";
import { BannerDocument } from "./banner.schema";

@Injectable()
export class BannerService extends BaseService<BannerDocument> {
    constructor(
        private readonly bannerRepository: BannerRepository
    ) {
        super(bannerRepository);
    }
}