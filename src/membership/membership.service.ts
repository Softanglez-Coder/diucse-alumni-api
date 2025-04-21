import { Injectable, NotFoundException, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './schemas/membership.schema';
import { MembershipStatus } from './enums/membership-status.enum';
import { MembershipEntity } from './entities/membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
  ) { }

  private toEntity(doc: Membership): MembershipEntity {
    return doc.toObject() as MembershipEntity;
  }

  async createMembership(
    createMembershipDto: CreateMembershipDto,
  ): Promise<MembershipEntity> {
    const newMembership = new this.membershipModel(createMembershipDto);
    const saved = await newMembership.save();
    return this.toEntity(saved);
  }

  async getAllMemberships(): Promise<MembershipEntity[]> {
    const memberships = await this.membershipModel.find().exec();
    return memberships.map(this.toEntity);
  }

  // Delete a membership and return the deleted entity (for possible undo)
  async deleteMembership(id: string): Promise<MembershipEntity> {
    const deleted = await this.membershipModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Membership not found');
    }
    return this.toEntity(deleted);
  }

  // Update a membership using UpdateMembershipDto
  async updateMembership(
    id: string,
    updateData: UpdateMembershipDto,
  ): Promise<MembershipEntity> {
    const updated = await this.membershipModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Membership not found');
    }
    return this.toEntity(updated);
  }

  // Approve membership (204 No Content)
  @HttpCode(204)
  async approveMembership(id: string): Promise<void> {
    const updated = await this.membershipModel.findByIdAndUpdate(
      id,
      { status: MembershipStatus.Approved },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Membership not found');
    }
    return;
  }

  // Reject membership (204 No Content)
  @HttpCode(204)
  async rejectMembership(id: string): Promise<void> {
    const updated = await this.membershipModel.findByIdAndUpdate(
      id,
      { status: MembershipStatus.Rejected },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Membership not found');
    }
    return;
  }
}

