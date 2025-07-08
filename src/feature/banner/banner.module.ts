import { Module } from "@nestjs/common";
import { BannerController } from "./banner.controller";
import { BannerService } from "./banner.service";
import { BannerRepository } from "./banner.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Banner, BannerSchema } from "./banner.schema";
import { StorageModule } from "@core";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Banner.name,
                schema: BannerSchema
            }
        ]),
        StorageModule
    ],
    controllers: [BannerController],
    providers: [BannerService, BannerRepository],
})
export class BannerModule {}