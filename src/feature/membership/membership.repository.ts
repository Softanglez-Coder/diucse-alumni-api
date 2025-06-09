import { BaseRepository } from "@core";
import { Injectable } from "@nestjs/common";
import { Membership, MembershipDocument } from "./membership.schema";
import { InjectModel } from "@nestjs/mongoose";
import { privateDecrypt } from "crypto";
import { Model } from "mongoose";

@Injectable()
export class MembershipRepository extends BaseRepository<MembershipDocument> {
    constructor(
        @InjectModel(Membership.name) private readonly membershipModel: Model<MembershipDocument>
    ) {
        super(membershipModel);
    }
}