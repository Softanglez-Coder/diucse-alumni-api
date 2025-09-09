import { IsMongoId, IsOptional, IsString, IsDateString } from 'class-validator';

export class AssignCommitteeMemberDto {
  @IsMongoId()
  committeeId: string;

  @IsMongoId()
  designationId: string;

  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsDateString()
  assignedDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
