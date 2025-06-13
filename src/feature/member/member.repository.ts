import { BaseRepository } from "@core";
import { Member, MemberDocument } from "./member.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class MemberRepository extends BaseRepository<MemberDocument> {
    constructor(
        @InjectModel(Member.name) private readonly memberModel: Model<MemberDocument>
    ) {
        super(memberModel);
    }
}