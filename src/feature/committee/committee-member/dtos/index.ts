import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCommitteeMemberDto {
  @IsMongoId()
  member: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  committee: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  designation: mongoose.Schema.Types.ObjectId;
}

export class UpdateCommitteeMemberDto {
  @IsMongoId()
  member: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  committee: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  designation: mongoose.Schema.Types.ObjectId;
}
