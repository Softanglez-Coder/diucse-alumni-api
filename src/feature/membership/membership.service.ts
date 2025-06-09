import { BaseService } from '@core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Membership, MembershipDocument } from './membership.schema';
import { MembershipRepository } from './membership.repository';
import { UserService } from '../user';
import { MembershipStatus } from './membership-status';

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
            user: user._id as any
        };

        const createdMembership = await this.membershipRepository.create(membership);
        this.logger.log(`Membership created for user ${userId}`);

        return createdMembership;
    }
}
