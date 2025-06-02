import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MembershipStatus } from "./enums";
import { Role } from "@core";
import { Member, MemberDocument } from "./member.schema";

@Injectable()
export class MemberRepository {
    constructor(
        @InjectModel(Member.name) private readonly memberModel: Model<MemberDocument>
    ) {}

    async create(member: Member): Promise<MemberDocument> {
        const newMember = new this.memberModel(member);
        return newMember.save();
    }

    async findById(id: string, withHash: boolean = false): Promise<MemberDocument | null> {
        const query = this.memberModel.findById(id);
     
        if (withHash) {
            query.select("+hash");
        }
     
        return query.exec();
    }

    async findByEmail(email: string, withHash: boolean = false): Promise<MemberDocument | null> {
        const query = this.memberModel.findOne({ email });
     
        if (withHash) {
            query.select("+hash");
        }
     
        return query.exec();
    }

    async update(id: string, member: Partial<Member>): Promise<MemberDocument | null> {
        return this.memberModel.findByIdAndUpdate(
            id,
            member,
            { new: true, runValidators: true }
        ).exec();
    }

    async findDrafted(): Promise<MemberDocument[]> {
        return this.memberModel.find({ status: MembershipStatus.Draft }).exec();
    }

    async findApplied(): Promise<MemberDocument[]> {
        return this.memberModel.find({ status: MembershipStatus.Applied }).exec();
    }

    async findInReview(): Promise<MemberDocument[]> {
        return this.memberModel.find({ status: MembershipStatus.InReview }).exec();
    }

    async findInformationRequired(): Promise<MemberDocument[]> {
        return this.memberModel.find({ status: MembershipStatus.InformationRequired }).exec();
    }

    async findPaymentRequired(): Promise<MemberDocument[]> {
        return this.memberModel.find({ status: MembershipStatus.PaymentRequired }).exec();
    }

    async findApproved(): Promise<MemberDocument[]> {
        return this.memberModel.find({ status: MembershipStatus.Approved }).exec();
    }

    async findRejected(): Promise<MemberDocument[]> {
        return this.memberModel.find({ status: MembershipStatus.Rejected }).exec();
    }

    async markAsApplied(id: string): Promise<MemberDocument | null> {
        return this.update(id, { status: MembershipStatus.Applied });
    }

    async markAsInReview(id: string): Promise<MemberDocument | null> {
        return this.update(id, { status: MembershipStatus.InReview });
    }

    async markAsInformationRequired(id: string): Promise<MemberDocument | null> {
        return this.update(id, { status: MembershipStatus.InformationRequired });
    }

    async markAsPaymentRequired(id: string): Promise<MemberDocument | null> {
        return this.update(id, { status: MembershipStatus.PaymentRequired });
    }

    async markAsApproved(id: string): Promise<MemberDocument | null> {
        return this.update(id, {
            status: MembershipStatus.Approved,
            roles: [
                Role.Guest,
                Role.Member
            ]
        });
    }

    async markAsRejected(id: string, reason: string): Promise<MemberDocument | null> {
        return this.update(id, {
            status: MembershipStatus.Rejected,
            rejectionReason: reason,
            roles: [
                Role.Guest
            ]
        });
    }

    async block(id: string): Promise<MemberDocument | null> {
        return this.update(id, { blocked: true });
    }

    async unblock(id: string): Promise<MemberDocument | null> {
        return this.update(id, { blocked: false });
    }

    async assignRole(id: string, role: Role): Promise<MemberDocument | null> {
        const member = await this.findById(id);
        const roles = member?.roles || [];
        return this.update(id, { roles: [
            ...roles,
            role
        ] });
    }

    async removeRole(id: string, role: Role): Promise<MemberDocument | null> {
        const member = await this.findById(id);
        const roles = member?.roles || [];
        return this.update(id, { roles: roles.filter(r => r !== role) });
    }
}