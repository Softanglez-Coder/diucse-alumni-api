import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { Membership, MembershipSchema } from './schemas/membership.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
    ]),
  ],
  providers: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}
