import { BaseService, Role } from '@core';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Membership, MembershipDocument } from './membership.schema';
import { MembershipRepository } from './membership.repository';
import { UserDocument, UserService } from '../user';
import { MembershipStatus } from './membership-status';
import { InvoiceService } from '../invoice/invoice.service';
import {
  Invoice,
  InvoiceDocument,
  InvoiceRemarks,
  InvoiceStatus,
} from '../invoice';
import { SettingsService } from '../settings/settings.service';
import { SettingsKey } from '../settings/settings-key';
import { MailService, Template } from '../mail';

@Injectable()
export class MembershipService extends BaseService<MembershipDocument> {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly invoiceService: InvoiceService,
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly settingsService: SettingsService<any>,
    private readonly mailService: MailService,
  ) {
    super(membershipRepository);
  }

  async request(userId: string) {
    this.logger.log(`Requesting membership for user ID ${userId}`);

    const user = await this.userService.findById(userId);

    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const membership = await this.findByUserId(userId);

    let updatedMembership: MembershipDocument | null = null;

    if (!membership) {
      const newMembership: Membership = {
        user: userId as any,
        status: MembershipStatus.Requested,
      };

      const createdMembership =
        await this.membershipRepository.create(newMembership);
      this.logger.log(`New membership created with ID ${createdMembership.id}`);

      updatedMembership = createdMembership;
    } else {
      const id = membership.id;
      if (membership.status === MembershipStatus.Requested) {
        this.logger.error(`Membership with ID ${id} is already requested`);
        throw new ConflictException(
          `Membership with ID ${id} is already requested`,
        );
      }

      if (membership.status === MembershipStatus.Approved) {
        this.logger.error(`Membership with ID ${id} is already approved`);
        throw new ConflictException(
          `Membership with ID ${id} is already approved`,
        );
      }

      membership.status = MembershipStatus.Requested;
      updatedMembership = await this.membershipRepository.update(
        id,
        membership,
      );
    }

    this.logger.log(`Membership with ID ${updatedMembership} requested`);

    // Send request email
    try {
      await this.mailService.send({
        to: [user.email],
        subject: 'Membership Request Confirmation',
        template: Template.MembershipRequested,
        variables: {
          name: user.name,
        },
      });
      this.logger.log(`Request email sent to user ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send request email: ${error.message}`);
    }

    return updatedMembership;
  }

  async inProgress(id: string) {
    this.logger.log(`Starting review for membership with ID ${id}`);

    const membership = await this.membershipRepository.findById(id);
    if (!membership) {
      this.logger.error(`Membership with ID ${id} not found`);
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }

    if (membership.status === MembershipStatus.InProgress) {
      this.logger.error(`Membership with ID ${id} is already in progress`);
      throw new ConflictException(
        `Membership with ID ${id} is already in progress`,
      );
    }

    if (membership.status === MembershipStatus.Approved) {
      this.logger.error(`Membership with ID ${id} is already approved`);
      throw new ConflictException(
        `Membership with ID ${id} is already approved`,
      );
    }

    if (membership.status !== MembershipStatus.Requested) {
      this.logger.error(`Membership with ID ${id} is not in requested status`);
      throw new BadRequestException(
        `Membership with ID ${id} is not in requested status`,
      );
    }

    membership.status = MembershipStatus.InProgress;
    const updatedMembership = await this.membershipRepository.update(
      id,
      membership,
    );
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

    if (membership.status === MembershipStatus.PaymentRequired) {
      this.logger.error(`Membership with ID ${id} is already payment required`);
      throw new ConflictException(
        `Membership with ID ${id} is already payment required`,
      );
    }

    if (membership.status === MembershipStatus.Approved) {
      this.logger.error(`Membership with ID ${id} is already approved`);
      throw new ConflictException(
        `Membership with ID ${id} is already approved`,
      );
    }

    if (membership.status !== MembershipStatus.InProgress) {
      this.logger.error(`Membership with ID ${id} is not in progress status`);
      throw new BadRequestException(
        `Membership with ID ${id} is not in progress status`,
      );
    }

    membership.status = MembershipStatus.PaymentRequired;

    let membershipFee = 0;
    const membershipFeeSettings = await this.settingsService.findByProperty(
      'key',
      SettingsKey.MembershipFee,
    );
    if (!membershipFeeSettings) {
      this.logger.error('Membership fee settings not found');
      throw new NotFoundException('Membership fee settings not found');
    }

    const isValidFee =
      typeof membershipFeeSettings.value === 'number' &&
      membershipFeeSettings.value >= 0;
    if (!isValidFee) {
      this.logger.error('Invalid membership fee value');
      throw new BadRequestException('Invalid membership fee value');
    }

    membershipFee = membershipFeeSettings.value;
    if (membershipFee <= 0) {
      this.logger.error('Membership fee must be greater than zero');
      throw new BadRequestException('Membership fee must be greater than zero');
    }

    this.logger.log(
      `Membership fee set to ${membershipFee} for membership ID ${id}`,
    );

    const membershipFeeInvoice: Invoice = {
      amount: membershipFee,
      user: (membership.user as UserDocument)?.id,
      remarks: InvoiceRemarks.MembershipFee,
    };

    const invoice = await this.invoiceService.create(membershipFeeInvoice);
    if (!invoice) {
      this.logger.error('Something went wrong on creating invoice');
      throw new InternalServerErrorException('Failed to create invoice');
    }

    membership.invoice = invoice.id;

    const updatedMembership = await this.membershipRepository.update(
      id,
      membership,
    );

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

    if (membership.status === MembershipStatus.Approved) {
      this.logger.error(`Membership with ID ${id} is already approved`);
      throw new ConflictException(
        `Membership with ID ${id} is already approved`,
      );
    }

    if (membership.status === MembershipStatus.PaymentRequired) {
      const invoice = membership.invoice as InvoiceDocument;
      if (invoice.status !== InvoiceStatus.Paid) {
        this.logger.error(
          `Membership with ID ${id} cannot be approved because payment is required and invoice status is ${invoice.status}`,
        );
        throw new ConflictException(
          `Membership with ID ${id} cannot be approved because payment is required and invoice status is ${invoice.status}`,
        );
      }
    }

    const user = await this.userService.findById(
      (membership.user as UserDocument)?.id,
    );
    if (!user) {
      this.logger.error(`User with ID ${membership.user} not found`);
      throw new NotFoundException(`User with ID ${membership.user} not found`);
    }

    if (user.roles.includes(Role.Member)) {
      this.logger.error(`User with ID ${user.id} is already a member`);
      throw new ConflictException(
        `User with ID ${user.id} is already a member`,
      );
    }

    // check if name is set
    if (!user.name || user.name.trim() === '') {
      this.logger.error(`User with ID ${user.id} has no name set`);
      throw new BadRequestException(`User with ID ${user.id} has no name set`);
    }

    // check if batch is set
    if (!user.batch) {
      this.logger.error(`User with ID ${user.id} has no batch set`);
      throw new BadRequestException(`User with ID ${user.id} has no batch set`);
    }

    user.roles.push(Role.Member);
    const updatedUser = await this.userService.update(user.id, user);
    if (!updatedUser) {
      this.logger.error(`Failed to update user with ID ${user.id}`);
      throw new InternalServerErrorException(
        `Failed to update user with ID ${user.id}`,
      );
    }

    // Generate and assign membership ID
    try {
      await this.userService.assignMembershipId(user.id);
      this.logger.log(`Membership ID assigned to user ${user.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to assign membership ID to user ${user.id}: ${error.message}`,
      );
      // Continue with approval even if membership ID assignment fails
    }

    membership.status = MembershipStatus.Approved;
    membership.justification = null; // Clear justification on approval
    const updatedMembership = await this.membershipRepository.update(
      id,
      membership,
    );
    if (!updatedMembership) {
      this.logger.error(`Failed to update membership with ID ${id}`);
      throw new InternalServerErrorException(
        `Failed to update membership with ID ${id}`,
      );
    }

    this.logger.log(`Membership with ID ${id} approved`);

    // Send approval email
    try {
      await this.mailService.send({
        to: [user.email],
        subject: 'Membership Approved',
        template: Template.MembershipApproved,
        variables: {
          name: user.name,
        },
      });
      this.logger.log(`Approval email sent to user ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send approval email: ${error.message}`);
    }

    return updatedMembership;
  }

  async reject(id: string, justification: string) {
    this.logger.log(`Rejecting membership with ID ${id}`);

    const membership = await this.membershipRepository.findById(id);
    if (!membership) {
      this.logger.error(`Membership with ID ${id} not found`);
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }

    if (membership.status === MembershipStatus.Rejected) {
      this.logger.error(`Membership with ID ${id} is already rejected`);
      throw new ConflictException(
        `Membership with ID ${id} is already rejected`,
      );
    }

    membership.status = MembershipStatus.Rejected;
    membership.justification = justification;
    const updatedMembership = await this.membershipRepository.update(
      id,
      membership,
    );
    this.logger.log(`Membership with ID ${id} rejected`);

    // Send rejection email
    const user = await this.userService.findById(
      (membership.user as UserDocument)?.id,
    );
    if (!user) {
      this.logger.error(`User with ID ${membership.user} not found`);
      throw new NotFoundException(`User with ID ${membership.user} not found`);
    }

    try {
      await this.mailService.send({
        to: [user.email],
        subject: 'Membership Rejected',
        template: Template.MembershipRejected,
        variables: {
          name: user.name,
          justification: membership.justification,
        },
      });
      this.logger.log(`Rejection email sent to user ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send rejection email: ${error.message}`);
    }

    return updatedMembership;
  }

  async findByUserId(userId: string): Promise<MembershipDocument | null> {
    this.logger.log(`Finding membership for user with ID ${userId}`);

    const membership = await this.membershipRepository.findByProperty(
      'user',
      userId,
    );

    if (!membership) {
      this.logger.warn(`No membership found for user with ID ${userId}`);
      return null;
    }

    this.logger.log(`Membership found for user with ID ${userId}`);
    return membership;
  }
}
