import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MembershipRequestDto, MembershipRequestUpdateDto } from './dto';
import { MembershipRequestStatus } from './enums/membership-request-status';
import { Membership, MembershipDocument } from './membership.schema';

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectModel(Membership.name)
    private readonly membershipModel: Model<MembershipDocument>,
  ) {}

  async create(dto: MembershipRequestDto): Promise<MembershipDocument> {
    const membership = new this.membershipModel(dto);
    return await membership.save();
  }

  async findById(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<MembershipDocument | null> {
    return await this.membershipModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<MembershipDocument | null> {
    return await this.membershipModel.findOne({ phone }).exec();
  }

  async update(
    id: string,
    dto: Partial<MembershipRequestUpdateDto>,
  ): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async findPendings(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.PENDING })
      .exec();
  }

  async findInProgress(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.IN_PROGRESS })
      .exec();
  }

  async findValidated(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.VALIDATED })
      .exec();
  }

  async findApproved(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.APPROVED })
      .exec();
  }

  async findRejected(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.REJECTED })
      .exec();
  }

  async inProgress(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        { status: MembershipRequestStatus.IN_PROGRESS },
        { new: true },
      )
      .exec();
  }

  async validate(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        { status: MembershipRequestStatus.VALIDATED },
        { new: true },
      )
      .exec();
  }

  async approve(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        { status: MembershipRequestStatus.APPROVED },
        { new: true },
      )
      .exec();
  }

  async reject(
    id: string,
    justification: string,
  ): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        {
          status: MembershipRequestStatus.REJECTED,
          justification,
        },
        { new: true },
      )
      .exec();
  }

  async pay(id: string, paymentId: string) {
    return await this.membershipModel
      .findByIdAndUpdate(id, { payment: paymentId }, { new: true })
      .exec();
  }
}
