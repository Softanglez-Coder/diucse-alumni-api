import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Membership } from './schemas/membership.schema';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
  ) {}

  async createMembership(
    createMembershipDto: CreateMembershipDto,
  ): Promise<Membership> {
    const newMembership = new this.membershipModel(createMembershipDto);
    return newMembership.save();
  }

  async getAllMemberships(): Promise<Membership[]> {
    return this.membershipModel.find().exec();
  }

  async deleteMembership(id: string): Promise<{ message: string }> {
    const result = await this.membershipModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Membership not found');
    }
    return { message: 'Membership deleted successfully' };
  }

  async updateMembership(
    id: string,
    updateData: Partial<Membership>,
  ): Promise<any> {
    const updatedMembership = await this.membershipModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updatedMembership) {
      throw new NotFoundException('Membership not found');
    }

    return {
      message: 'Membership updated successfully',
      updatedData: updatedMembership,
    };
  }

  async approveMembership(id: string): Promise<any> {
    const updatedMembership = await this.membershipModel.findByIdAndUpdate(
      id,
      { status: 'approved' }, 
      { new: true }, 
    );

    if (!updatedMembership) {
      throw new NotFoundException('Membership not found');
    }

    return {
      message: 'Membership approved successfully',
      updatedData: updatedMembership,
    };
  }


  async rejectMembership(id: string): Promise<any> {
    const updatedMembership = await this.membershipModel.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }, 
    );

    if (!updatedMembership) {
      throw new NotFoundException('Membership not found');
    }

    return {
      message: 'Membership rejected successfully',
      updatedData: updatedMembership,
    };
  }
}
