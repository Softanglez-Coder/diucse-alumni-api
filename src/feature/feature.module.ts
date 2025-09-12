import { Module } from '@nestjs/common';
import { MailModule } from './mail';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user';
import { MembershipModule } from './membership/membership.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { EventModule } from './event/event.module';
import { BlogModule } from './blog/blog.module';
import { NoticeModule } from './notice/notice.module';
import { BatchModule } from './batch/batch.module';
import { SettingsModule } from './settings/settings.module';
import { BannerModule } from './banner';
import { CommitteeModule } from './committee';
import { CommitteeDesignationModule } from './committee-designation';

@Module({
  imports: [
    MailModule,
    UserModule,
    AuthModule,
    MembershipModule,
    InvoiceModule,
    PaymentModule,
    EventModule,
    BlogModule,
    NoticeModule,
    BatchModule,
    SettingsModule,
    BannerModule,
    CommitteeModule,
    CommitteeDesignationModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class FeatureModule {}
