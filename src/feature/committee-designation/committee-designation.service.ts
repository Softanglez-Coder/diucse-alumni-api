import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BaseService } from '@core';
import { Types } from 'mongoose';
import { CommitteeDesignationRepository } from './committee-designation.repository';
import { CommitteeMemberRepository } from './committee-member.repository';
import { CommitteeDesignationDocument } from './committee-designation.schema';
import { CommitteeMemberDocument } from './committee-member.schema';
import { 
  CreateCommitteeDesignationDto, 
  UpdateCommitteeDesignationDto,
  AssignCommitteeMemberDto,
  UnassignCommitteeMemberDto
} from './dtos';

@Injectable()
export class CommitteeDesignationService extends BaseService<CommitteeDesignationDocument> {
  constructor(
    private readonly committeeDesignationRepository: CommitteeDesignationRepository,
    private readonly committeeMemberRepository: CommitteeMemberRepository,
  ) {
    super(committeeDesignationRepository);
  }

  async createDesignation(createDto: CreateCommitteeDesignationDto): Promise<CommitteeDesignationDocument> {
    const designationData = {
      ...createDto,
      committeeId: new Types.ObjectId(createDto.committeeId),
      displayOrder: createDto.displayOrder ?? 0,
    };
    
    return await this.committeeDesignationRepository.create(designationData);
  }

  async updateDesignation(id: string, updateDto: UpdateCommitteeDesignationDto): Promise<CommitteeDesignationDocument> {
    const designation = await this.committeeDesignationRepository.findById(id);
    if (!designation) {
      throw new NotFoundException('Committee designation not found');
    }

    return await this.committeeDesignationRepository.update(id, updateDto);
  }

  async getDesignationsByCommittee(committeeId: string): Promise<CommitteeDesignationDocument[]> {
    return await this.committeeDesignationRepository.findByCommitteeId(committeeId);
  }

  async assignMember(assignDto: AssignCommitteeMemberDto): Promise<CommitteeMemberDocument> {
    const { committeeId, designationId, userId, assignedDate, notes } = assignDto;

    // Check if user already has an active assignment in this committee
    const existingAssignment = await this.committeeMemberRepository.findActiveByUserAndCommittee(userId, committeeId);
    if (existingAssignment) {
      throw new BadRequestException('User already has an active assignment in this committee');
    }

    // Check if designation already has an active member in this committee
    const existingDesignationMember = await this.committeeMemberRepository.findActiveByDesignationAndCommittee(designationId, committeeId);
    if (existingDesignationMember) {
      throw new BadRequestException('This designation already has an active member assigned');
    }

    const memberData = {
      committeeId: new Types.ObjectId(committeeId),
      designationId: new Types.ObjectId(designationId),
      userId: new Types.ObjectId(userId),
      assignedDate: assignedDate ? new Date(assignedDate) : new Date(),
      notes,
      isActive: true,
    };

    return await this.committeeMemberRepository.create(memberData);
  }

  async unassignMember(memberId: string, unassignDto: UnassignCommitteeMemberDto): Promise<CommitteeMemberDocument> {
    const member = await this.committeeMemberRepository.findById(memberId);
    if (!member) {
      throw new NotFoundException('Committee member not found');
    }

    if (!member.isActive) {
      throw new BadRequestException('Member is already unassigned');
    }

    const updateData = {
      isActive: false,
      unassignedDate: unassignDto.unassignedDate ? new Date(unassignDto.unassignedDate) : new Date(),
      notes: unassignDto.notes || member.notes,
    };

    return await this.committeeMemberRepository.update(memberId, updateData);
  }

  async getCommitteeMembers(committeeId: string, includeInactive = false): Promise<CommitteeMemberDocument[]> {
    return await this.committeeMemberRepository.findByCommitteeId(committeeId, !includeInactive);
  }

  async getUserCommitteeHistory(userId: string, includeInactive = false): Promise<CommitteeMemberDocument[]> {
    return await this.committeeMemberRepository.findByUserId(userId, !includeInactive);
  }

  async getCommitteeWithMembers(committeeId: string, includeInactive = false): Promise<{
    designations: CommitteeDesignationDocument[];
    members: CommitteeMemberDocument[];
  }> {
    const [designations, members] = await Promise.all([
      this.getDesignationsByCommittee(committeeId),
      this.getCommitteeMembers(committeeId, includeInactive),
    ]);

    return { designations, members };
  }

  async getCommitteeStructure(committeeId: string): Promise<{
    designation: CommitteeDesignationDocument;
    member: CommitteeMemberDocument | null;
  }[]> {
    const designations = await this.getDesignationsByCommittee(committeeId);
    const structure = [];

    for (const designation of designations) {
      const member = await this.committeeMemberRepository.findActiveByDesignationAndCommittee(
        designation._id.toString(),
        committeeId
      );
      structure.push({ designation, member });
    }

    return structure;
  }

  async getUserActiveRoles(userId: string): Promise<string[]> {
    const activeAssignments = await this.committeeMemberRepository.findByUserId(userId, true);
    const rolesSet = new Set<string>();

    for (const assignment of activeAssignments) {
      if (assignment.designationId && typeof assignment.designationId === 'object' && 'roles' in assignment.designationId) {
        const designation = assignment.designationId as any;
        designation.roles?.forEach((role: string) => rolesSet.add(role));
      }
    }

    return Array.from(rolesSet);
  }
}
