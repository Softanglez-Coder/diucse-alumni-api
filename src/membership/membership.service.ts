import {
  Injectable,
  NotFoundException,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './schemas/membership.schema';
import { MembershipStatus } from './enums/membership-status.enum';
import { MembershipEntity } from './entities/membership.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private toEntity(doc: Membership): MembershipEntity {
    return doc.toObject() as MembershipEntity;
  }

  // Create a new membership
  async createMembership(
    createMembershipDto: CreateMembershipDto,
  ): Promise<MembershipEntity> {
    const newMembership = new this.membershipModel(createMembershipDto);
    const saved = await newMembership.save();

    // Invalidate the cache after creating a new membership
    await this.cacheManager.del('memberships:all');

    return this.toEntity(saved);
  }

  async getAllMemberships(): Promise<MembershipEntity[]> {
    const cacheKey = 'memberships:all';

    // Try to get the data from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as MembershipEntity[];
    }

    // If not found in cache, fetch from DB
    const memberships = await this.membershipModel.find().exec();
    const membershipsEntities = memberships.map(this.toEntity);

    // Save the result in cache with a TTL of 120 seconds
    await this.cacheManager.set(cacheKey, membershipsEntities, 120);

    return membershipsEntities;
  }

  // Delete a membership and return the deleted entity
  async deleteMembership(id: string): Promise<MembershipEntity> {
    const deleted = await this.membershipModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Membership not found');
    }

    // Invalidate cache after deleting a membership
    await this.cacheManager.del('memberships:all');

    return this.toEntity(deleted);
  }

  // Update a membership
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

    // Invalidate cache after updating a membership
    await this.cacheManager.del('memberships:all');

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

    // Invalidate cache after approving a membership
    await this.cacheManager.del('memberships:all');
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

    // Invalidate cache after rejecting a membership
    await this.cacheManager.del('memberships:all');
    return;
  }
}
