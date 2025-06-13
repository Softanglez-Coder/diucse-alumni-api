import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { MemberDocument } from './member.schema';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService extends BaseService<MemberDocument> {
    constructor(
        private readonly memberRepository: MemberRepository
    ) {
        super(memberRepository);
    }
}
