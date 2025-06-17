import { Module } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { CommitteeController } from './committee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Committee, CommitteeSchema } from './committee.schema';
import { CommitteeDesignation, CommitteeDesignationSchema } from './committee-designation.schema';
import { CommitteeMember, CommitteeMemberSchema } from './committee-member.schema';

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
      }
    ])
  ],
  providers: [CommitteeService],
  controllers: [CommitteeController],
})
export class CommitteeModule {}
