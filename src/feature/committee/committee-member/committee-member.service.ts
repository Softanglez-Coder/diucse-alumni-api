import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { CommitteeMemberDocument } from './committee-member.schema';
import { CommitteeMemberRepository } from './committee-member.repository';

@Injectable()
export class CommitteeMemberService extends BaseService<CommitteeMemberDocument> {
  constructor(
    private readonly commiteeMemberRepository: CommitteeMemberRepository,
  ) {
    super(commiteeMemberRepository);
  }
}
