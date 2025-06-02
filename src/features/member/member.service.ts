import { Role } from "@core";
import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, NotImplementedException } from "@nestjs/common";
import { MembershipStatus } from "./enums";
import * as bcrypt from "bcrypt";
import { CreateMemberRequest, UpdateMemberRequest } from "./requests";
import { MemberRepository } from "./member.repository";
import { Member } from "./member.schema";

@Injectable()
export class MemberService {
    private readonly logger: Logger = new Logger(MemberService.name);

    constructor(
        private readonly memberRepository: MemberRepository,
    ) {}

    async create(dto: CreateMemberRequest) {
        const existingMember = await this.memberRepository.findByEmail(dto.email, true);
        
        if (existingMember) {
            throw new ConflictException(`Member with email ${dto.email} already exists.`);
        }

        const hash = bcrypt.hashSync(dto.password, 10);
        const member: Member = {
            ...dto,
            hash
        }

        const created = await this.memberRepository.create(member);
        if (!created) {
            throw new InternalServerErrorException("Failed to create member.");
        }

        this.logger.log(`Member created with email: ${dto.email}`);
        return created;
    }

    async findById(id: string, withHash: boolean = false) {
        const member = await this.memberRepository.findById(id, withHash);
        
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }
        
        return member;
    }

    async findByEmail(email: string, withHash: boolean = false) {
        const member = await this.memberRepository.findByEmail(email, withHash);
        
        if (!member) {
            throw new NotFoundException(`Member with email ${email} not found.`);
        }
        
        return member;
    }

    async update(id: string, dto: UpdateMemberRequest) {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        const updatedMember = await this.memberRepository.update(id, dto);
        if (!updatedMember) {
            throw new InternalServerErrorException(`Failed to update member with id ${id}.`);
        }

        return updatedMember;
    }

    async findDrafted() {
        return await this.memberRepository.findDrafted();
    }

    async findApplied() {
        return await this.memberRepository.findApplied();
    }

    async findInReview() {
        return await this.memberRepository.findInReview();
    }

    async findInformationRequired() {
        return await this.memberRepository.findInformationRequired();
    }

    async findPaymentRequired() {
        return await this.memberRepository.findPaymentRequired();
    }

    async findApproved() {
        return await this.memberRepository.findApproved();
    }

    async findRejected() {
        return await this.memberRepository.findRejected();
    }

    async markAsApplied(id: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.status === MembershipStatus.Applied) {
            throw new ConflictException(`Member with id ${id} is already in the Applied status.`);
        }

        if (member.status !== MembershipStatus.Draft) {
            throw new ConflictException(`Member with id ${id} must be in the Draft status to be marked as Applied.`);
        }

        if (!member.name) {
            throw new BadRequestException(`Member with id ${id} must have a name to be marked as Applied.`);
        }

        if (!member.email) {
            throw new BadRequestException(`Member with id ${id} must have an email to be marked as Applied.`);
        }

        if (!member.phone) {
            throw new BadRequestException(`Member with id ${id} must have a phone number to be marked as Applied.`);
        }

        return await this.memberRepository.markAsApplied(id);
    }

    async markAsInReview(id: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.status === MembershipStatus.Draft) {
            throw new ForbiddenException(`Member with id ${id} is in the Drafted status. Please mark as Applied first.`);
        }

        if (member.status === MembershipStatus.InReview) {
            throw new ConflictException(`Member with id ${id} is already in the InReview status.`);
        }

        if (member.status !== MembershipStatus.Applied) {
            throw new ConflictException(`Member with id ${id} must be in the Applied status to be marked as InReview.`);
        }

        return await this.memberRepository.markAsInReview(id);
    }

    async markAsInformationRequired(id: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.status === MembershipStatus.InformationRequired) {
            throw new ConflictException(`Member with id ${id} is already in the InformationRequired status.`);
        }

        if (member.status !== MembershipStatus.InReview) {
            throw new ConflictException(`Member with id ${id} must be in the InReview status to be marked as InformationRequired.`);
        }

        return await this.memberRepository.markAsInformationRequired(id);
    }

    async markAsPaymentRequired(id: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);

        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.status === MembershipStatus.PaymentRequired) {
            throw new ConflictException(`Member with id ${id} is already in the PaymentRequired status.`);
        }

        if (member.status !== MembershipStatus.InReview && member.status !== MembershipStatus.InformationRequired) {
            throw new ConflictException(`Member with id ${id} must be in the InReview or InformationRequired status to be marked as PaymentRequired.`);
        }

        return await this.memberRepository.markAsPaymentRequired(id);
    }

    async markAsApproved(id: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.status === MembershipStatus.Approved) {
            throw new ConflictException(`Member with id ${id} is already in the Approved status.`);
        }

        if (member.status === MembershipStatus.InformationRequired) {
            throw new BadRequestException(`Member with id ${id} must not be in the InformationRequired status to be marked as Approved.`);
        }

        if (member.status === MembershipStatus.PaymentRequired) {
            throw new BadRequestException(`Member with id ${id} must not be in the PaymentRequired status to be marked as Approved.`);
        }

        if (member.blocked) {
            throw new ConflictException(`Member with id ${id} is blocked and cannot be marked as Approved.`);
        }

        return await this.memberRepository.markAsApproved(id);
    }

    async markAsRejected(id: string, reason: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.status === MembershipStatus.Rejected) {
            throw new ConflictException(`Member with id ${id} is already in the Rejected status.`);
        }

        if (member.status === MembershipStatus.Approved) {
            throw new BadRequestException(`Member with id ${id} must not be in the Approved status to be marked as Rejected.`);
        }

        if (!reason || reason.trim() === '') {
            throw new BadRequestException(`Reason for rejection must be provided for member with id ${id}.`);
        }

        return await this.memberRepository.markAsRejected(id, reason);
    }

    async block(id: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.blocked) {
            throw new ConflictException(`Member with id ${id} is already blocked.`);
        }

        return await this.memberRepository.block(id);
    }

    async unblock(id: string): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (!member.blocked) {
            throw new ConflictException(`Member with id ${id} is not blocked.`);
        }

        return await this.memberRepository.unblock(id);
    }

    async assignRole(id: string, role: Role): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (member.roles.includes(role)) {
            throw new ConflictException(`Member with id ${id} already has the role ${role}.`);
        }

        return await this.memberRepository.assignRole(id, role);
    }

    async removeRole(id: string, role: Role): Promise<unknown> {
        const member = await this.memberRepository.findById(id);
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found.`);
        }

        if (!member.roles.includes(role)) {
            throw new ConflictException(`Member with id ${id} does not have the role ${role}.`);
        }

        return await this.memberRepository.removeRole(id, role);
    }

    async createBot(): Promise<Member> {
        const email: string = process.env.BOT_EMAIL;
        if (!email) {
            throw new BadRequestException("Bot email is not set in environment variables.");
        }

        const password: string = process.env.BOT_PASSWORD;
        if (!password) {
            throw new BadRequestException("Bot password is not set in environment variables.");
        }

        const phone: string = '+0000000000'; // Default phone number for the bot
        const name: string = 'Bot'; // Default name for the bot
        const roles: Role[] = [Role.SuperAdmin];
        const status = MembershipStatus.Approved;
        const blocked = false;

        const hash = bcrypt.hashSync(password, 10);
        const payload: Member = {
            email,
            phone,
            blocked,
            hash,
            name,
            roles,
            status
        };

        const existingMember = await this.memberRepository.findByEmail(email, true);
        if (!existingMember) {
            const created = await this.memberRepository.create(payload);
            
            if (!created) {
                throw new InternalServerErrorException("Failed to create bot member.");
            }

            this.logger.log(`Bot member created with email: ${email}`);
            return created;
        } else {
            this.logger.warn(`Bot member with email: ${email} already exists.`);
            return existingMember;
        }
    }
}