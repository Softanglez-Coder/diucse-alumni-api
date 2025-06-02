import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Member, MemberSchema } from "./member.schema";
import { MemberService } from "./member.service";
import { MemberRepository } from "./member.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Member.name,
                schema: MemberSchema,
            }
        ])
    ],
    providers: [
        MemberService,
        MemberRepository
    ],
    exports: [
        MemberService
    ]
})
export class MemberModule {}