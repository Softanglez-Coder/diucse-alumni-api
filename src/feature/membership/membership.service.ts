import { BaseService } from '@core';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Membership, MembershipDocument } from './membership.schema';
import { MembershipRepository } from './membership.repository';
import { UserDocument, UserService } from '../user';
import { MembershipStatus } from './membership-status';
import mongoose from 'mongoose';
import { InvoiceService } from '../invoice/invoice.service';
import { CreateInvoiceDto } from '../invoice/create-invoice.dto';
import { Invoice, InvoiceRemarks } from '../invoice';

@Injectable()
export class MembershipService extends BaseService<MembershipDocument> {
    private readonly MEMBERSHIP_FEE = 500;

    constructor(
        private readonly membershipRepository: MembershipRepository,
        private readonly invoiceService: InvoiceService,
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

    async paymentRequired(id: string) {
        this.logger.log(`Marking membership with ID ${id} as payment required`);

        const membership = await this.membershipRepository.findById(id);
        if (!membership) {
            this.logger.error(`Membership with ID ${id} not found`);
            throw new NotFoundException(`Membership with ID ${id} not found`);
        }

        membership.status = MembershipStatus.PaymentRequired;
        const updatedMembership = await this.membershipRepository.update(id, membership);

        const membershipFeeInvoice: Invoice = {
            amount: this.MEMBERSHIP_FEE,
            user: (membership.user as UserDocument)?.id,
            remarks: InvoiceRemarks.MembershipFee,
        };
        
        const invoice = await this.invoiceService.create(membershipFeeInvoice);
        if (!invoice) {
            this.logger.error('Something went wrong on creating invoice');
            throw new InternalServerErrorException('Failed to create invoice');
        }

        this.logger.log(`Membership with ID ${id} marked as payment required`);

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
