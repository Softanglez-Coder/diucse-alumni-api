import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UnassignCommitteeMemberDto {
  @IsOptional()
  @IsDateString()
  unassignedDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
