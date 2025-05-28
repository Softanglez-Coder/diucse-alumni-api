import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member, MemberDocument } from './member.schema';
import { CreateMemberDto } from './dtos';
import { Model } from 'mongoose';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  async create(dto: CreateMemberDto) {
    const member = new this.memberModel(dto);
    return await member.save();
  }

  async findByEmail(email: string): Promise<MemberDocument | null> {
    return await this.memberModel.findOne({ email }).exec();
  }
}
