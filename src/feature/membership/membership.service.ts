import { BaseService } from '@core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Membership, MembershipDocument } from './membership.schema';
import { MembershipRepository } from './membership.repository';
import { UserService } from '../user';
import { MembershipStatus } from './membership-status';
import mongoose from 'mongoose';

@Injectable()
export class MembershipService extends BaseService<MembershipDocument> {
    constructor(
        private readonly membershipRepository: MembershipRepository,
        private readonly logger: Logger,
        private readonly userService: UserService
    ) {
        super(membershipRepository);
    }

    async enroll(userId: string) {
        this.logger.log(`Enrolling user with ID ${userId}`);

        const user = await this.userService.findById(userId);
        if (!user) {
            this.logger.error(`User with ID ${userId} not found`);
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const membership: Membership = {
            user: user.id
        };

        const createdMembership = await this.membershipRepository.create(membership);
        this.logger.log(`Membership created for user ${userId}`);

        return createdMembership;
    }

    async request(id: string) {
        this.logger.log(`Requesting membership with ID ${id}`);

        const membership = await this.membershipRepository.findById(id);
        if (!membership) {
            this.logger.error(`Membership with ID ${id} not found`);
            throw new NotFoundException(`Membership with ID ${id} not found`);
        }

        membership.status = MembershipStatus.Requested;
        const updatedMembership = await this.membershipRepository.update(id, membership);
        this.logger.log(`Membership with ID ${id} requested`);

        return updatedMembership;
    }

    async inProgress(id: string) {
        this.logger.log(`Starting review for membership with ID ${id}`);

        const membership = await this.membershipRepository.findById(id);
        if (!membership) {
            this.logger.error(`Membership with ID ${id} not found`);
            throw new NotFoundException(`Membership with ID ${id} not found`);
        }

        membership.status = MembershipStatus.InProgress;
        const updatedMembership = await this.membershipRepository.update(id, membership);
        this.logger.log(`Review started for membership with ID ${id}`);

        return updatedMembership;
    }

    async approve(id: string) {
        this.logger.log(`Approving membership with ID ${id}`);

        const membership = await this.membershipRepository.findById(id);
        if (!membership) {
            this.logger.error(`Membership with ID ${id} not found`);
            throw new NotFoundException(`Membership with ID ${id} not found`);
        }

        membership.status = MembershipStatus.Approved;
        const updatedMembership = await this.membershipRepository.update(id, membership);
        this.logger.log(`Membership with ID ${id} approved`);

        return updatedMembership;
    }

    async reject(id: string, justification: string) {
        this.logger.log(`Rejecting membership with ID ${id}`);

        const membership = await this.membershipRepository.findById(id);
        if (!membership) {
            this.logger.error(`Membership with ID ${id} not found`);
            throw new NotFoundException(`Membership with ID ${id} not found`);
        }

        membership.status = MembershipStatus.Rejected;
        membership.justification = justification;
        const updatedMembership = await this.membershipRepository.update(id, membership);
        this.logger.log(`Membership with ID ${id} rejected`);

        return updatedMembership;
    }
}
