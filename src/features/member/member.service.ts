import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { CreateMemberDto, UpdateMemberDto } from './dtos';
import { UserService } from '@user';
import { MailerService, Role } from '@core';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async create(dto: CreateMemberDto) {
    return await this.memberRepository.create(dto);
  }

  async findByEmail(email: string) {
    return await this.memberRepository.findByEmail(email);
  }

  async findAll() {
    return await this.memberRepository.findAll();
  }

  async findById(id: string) {
    return await this.memberRepository.findById(id);
  }

  async update(id: string, dto: UpdateMemberDto) {
    const member = await this.memberRepository.findById(id);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const updated = await this.memberRepository.update(id, dto);
    if (!updated) {
      throw new HttpException(
        'Failed to update member',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updated;
  }

  async block(id: string, justification: string) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const blocked = await this.userService.block(member.email, justification);
    if (!blocked) {
      throw new HttpException(
        'Failed to block member',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      const body = `
        <h1>You have been blocked!</h1>
        
        <p>
          Your account has been blocked from DIU CSE Alumni due to the following reason: <strong>${justification}</strong>.
          If you believe this is a mistake, please contact support.
        </p>
      `;

      await this.mailerService.sendMail(
        member.email,
        'Sorry, you have been blocked',
        body,
      );
    } catch (e) {
      throw new HttpException(
        'Failed to send email notification due to: ' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      message: 'Member blocked successfully',
    };
  }

  async unblock(id: string, justification: string) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const unblocked = await this.userService.unblock(member.email, justification);
    if (!unblocked) {
      throw new HttpException(
        'Failed to unblock member',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      const body = `
        <h1>Your account has been unblocked!</h1>
        
        <p>
          Your account has been unblocked from DIU CSE Alumni. You can now access your account.
        </p>
      `;

      await this.mailerService.sendMail(
        member.email,
        'Your account has been unblocked',
        body,
      );
    } catch (e) {
      throw new HttpException(
        'Failed to send email notification due to: ' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      message: 'Member unblocked successfully',
    };
  }

  async assignRoles(id: string, roles: Role[]) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const assigned = await this.userService.assignRoles(member.email, roles);
    if (!assigned) {
      throw new HttpException(
        'Failed to assign roles to member',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      const body = `
        <h1>Roles assigned to your account</h1>
        
        <p>
          The following roles have been assigned to your account: <strong>${roles.join(', ')}</strong>.
          If you believe this is a mistake, please contact support.
        </p>
      `;

      await this.mailerService.sendMail(
        member.email,
        'Roles assigned to your account',
        body,
      );
    } catch (e) {
      throw new HttpException(
        'Failed to send email notification due to: ' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      message: 'Roles assigned successfully',
    };
  }

  async removeRoles(id: string, roles: Role[]) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (roles.includes(Role.MEMBER)) {
      throw new ForbiddenException(
        'You can not remove MEMBER role. If you need to restrict access, block the member instead.',
      );
    }

    const unassigned = await this.userService.removeRoles(member.email, roles);
    if (!unassigned) {
      throw new HttpException(
        'Failed to remove roles from member',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      const body = `
        <h1>Roles removed from your account</h1>
        
        <p>
          The following roles have been removed from your account: <strong>${roles.join(', ')}</strong>.
          If you believe this is a mistake, please contact support.
        </p>
      `;

      await this.mailerService.sendMail(
        member.email,
        'Roles removed from your account',
        body,
      );
    } catch (e) {
      throw new HttpException(
        'Failed to send email notification due to: ' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      message: 'Roles removed successfully',
    };
  }
}
