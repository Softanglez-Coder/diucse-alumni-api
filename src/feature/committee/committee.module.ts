import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommitteeDesignation,
  CommitteeDesignationController,
  CommitteeDesignationRepository,
  CommitteeDesignationSchema,
  CommitteeDesignationService,
} from './committee-designation';
import {
  CommitteeMember,
  CommitteeMemberController,
  CommitteeMemberRepository,
  CommitteeMemberSchema,
  CommitteeMemberService,
} from './committee-member';
import {
  Committee,
  CommitteeController,
  CommitteeRepository,
  CommitteeSchema,
  CommitteeService,
} from './committee';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Committee.name,
        schema: CommitteeSchema,
      },
      {
        name: CommitteeDesignation.name,
        schema: CommitteeDesignationSchema,
      },
      {
        name: CommitteeMember.name,
        schema: CommitteeMemberSchema,
      },
    ]),
  ],
  providers: [
    CommitteeService,
    CommitteeDesignationService,
    CommitteeMemberService,
    CommitteeRepository,
    CommitteeMemberRepository,
    CommitteeDesignationRepository,
  ],
  controllers: [
    CommitteeController,
    CommitteeMemberController,
    CommitteeDesignationController,
  ],
})
export class CommitteeModule {}
