import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './member.schema';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { MemberController } from './member.controller';
import { UserModule } from '@user';
import { MailerModule } from '@core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Member.name,
        schema: MemberSchema,
      },
    ]),
    UserModule,
    MailerModule
  ],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService],
})
export class MemberModule {}
