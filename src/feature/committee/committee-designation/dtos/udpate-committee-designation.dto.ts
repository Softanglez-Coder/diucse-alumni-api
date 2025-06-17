import { Role } from "@core";
import { IsString, IsEnum } from "class-validator";

export class UpdateCommitteeDesignationDto {
    @IsString()
     title: string;
 
     @IsEnum(Role, {
         each: true
     })
     roles: Role[];
}