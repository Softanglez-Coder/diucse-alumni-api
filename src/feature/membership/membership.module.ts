import { Logger, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { UserModule } from '../user';
import { MembershipRepository } from './membership.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from './membership.schema';
import { InvoiceModule } from '../invoice/invoice.module';
import { MemberModule } from '../member/member.module';
import { StorageModule } from '@core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Membership.name,
        schema: MembershipSchema,
      },
    ]),
    UserModule,
    InvoiceModule,
    MemberModule,
    StorageModule,
  ],
  exports: [MembershipService],
  providers: [Logger, MembershipService, MembershipRepository],
  controllers: [MembershipController],
})
export class MembershipModule {}
