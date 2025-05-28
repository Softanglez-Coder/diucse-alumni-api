import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { CreateMemberDto } from './dtos';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async create(dto: CreateMemberDto) {
    return await this.memberRepository.create(dto);
  }

  async findByEmail(email: string) {
    return await this.memberRepository.findByEmail(email);
  }
}
