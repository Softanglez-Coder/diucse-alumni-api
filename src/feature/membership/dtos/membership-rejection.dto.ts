import { IsNotEmpty, IsString } from 'class-validator';

export class MembershipRejectionDto {
  @IsString()
  @IsNotEmpty()
  justification: string;
}
