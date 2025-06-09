import { IsMongoId, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class MembershipApplicationDto {
    @IsMongoId()
    batchId: string;

    @IsPhoneNumber('BD')
    phone: string;

    @IsUrl()
    photo: string;
}