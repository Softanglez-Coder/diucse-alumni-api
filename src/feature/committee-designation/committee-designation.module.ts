import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommitteeDesignationController } from './committee-designation.controller';
import { CommitteeDesignationService } from './committee-designation.service';
import { CommitteeDesignationRepository } from './committee-designation.repository';
import { CommitteeMemberRepository } from './committee-member.repository';
import {
  CommitteeDesignation,
  CommitteeDesignationSchema,
} from './committee-designation.schema';
import {
  CommitteeMember,
  CommitteeMemberSchema,
} from './committee-member.schema';
import { UserModule } from '../user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommitteeDesignation.name, schema: CommitteeDesignationSchema },
      { name: CommitteeMember.name, schema: CommitteeMemberSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [CommitteeDesignationController],
  providers: [
    CommitteeDesignationService,
    CommitteeDesignationRepository,
    CommitteeMemberRepository,
  ],
  exports: [CommitteeDesignationService],
})
export class CommitteeDesignationModule {}
