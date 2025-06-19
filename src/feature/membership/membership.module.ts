import { Logger, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { UserModule } from '../user';
import { MembershipRepository } from './membership.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from './membership.schema';
import { InvoiceModule } from '../invoice/invoice.module';
import { StorageModule } from '@core';
import { MailModule } from '../mail';
import { SettingsModule } from '../settings/settings.module';

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
    StorageModule,
    MailModule,
    SettingsModule,
  ],
  exports: [MembershipService],
  providers: [Logger, MembershipService, MembershipRepository],
  controllers: [MembershipController],
})
export class MembershipModule {}
