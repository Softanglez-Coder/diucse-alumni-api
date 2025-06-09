import { BaseRepository } from "@core"
import { Batch, BatchDocument } from "./batch.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"

export class BatchRepository extends BaseRepository<BatchDocument> {
    constructor(
        @InjectModel(Batch.name) private readonly batchModel: Model<BatchDocument>
    ) {
        super(batchModel)
    }
}