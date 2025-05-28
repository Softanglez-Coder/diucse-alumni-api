import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from './membership.schema';
import { MembershipController } from './membership.controller';
import { MembershipRepository } from './membership.repository';
import { MembershipService } from './membership.service';
import { PaymentModule } from '@payment';
import { BatchModule } from '@batch';
import { ShiftModule } from '@shift';
import { UserModule } from '@user';
import { MemberModule } from '../member/member.module';
import { MailerModule } from '@core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Membership.name,
        schema: MembershipSchema,
      },
    ]),
    PaymentModule,
    BatchModule,
    ShiftModule,
    UserModule,
    MemberModule,
    MailerModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipRepository, MembershipService],
})
export class MembershipModule {}
