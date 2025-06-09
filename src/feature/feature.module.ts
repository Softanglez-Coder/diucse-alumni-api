import { Module } from '@nestjs/common';
import { MailModule } from './mail';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user';
import { MembershipModule } from './membership/membership.module';
import { MemberModule } from './member/member.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { PolicyModule } from './policy/policy.module';
import { CommitteeModule } from './committee/committee.module';
import { EventModule } from './event/event.module';
import { BlogModule } from './blog/blog.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    MailModule,
    UserModule,
    AuthModule,
    MembershipModule,
    MemberModule,
    InvoiceModule,
    PaymentModule,
    PolicyModule,
    CommitteeModule,
    EventModule,
    BlogModule,
    NoticeModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class FeatureModule {}
