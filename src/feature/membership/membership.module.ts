import { Logger, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { UserModule } from '../user';
import { MembershipRepository } from './membership.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from './membership.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Membership.name,
        schema: MembershipSchema
      }
    ]),
    UserModule
  ],
  providers: [
    Logger,
    MembershipService,
    MembershipRepository
  ],
  controllers: [MembershipController],
})
export class MembershipModule {}
